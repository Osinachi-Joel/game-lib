const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const sqlite3 = require('sqlite3');
const plist = (process.platform === 'darwin') ? require('plist') : null;

const allBookmarks = [];

function getBrowserPaths() {
  const home = os.homedir();
  const p = process.platform;
  const pts = { chrome: [], edge: [], firefox: [], opera: [], operaGX: [], safari: [] };

  if (p === 'win32') {
    pts.chrome.push(path.join(home, 'AppData', 'Local', 'Google', 'Chrome', 'User Data'));
    pts.edge.push(path.join(home, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data'));
    pts.firefox.push(path.join(home, 'AppData', 'Roaming', 'Mozilla', 'Firefox', 'Profiles'));
    pts.opera.push(path.join(home, 'AppData', 'Roaming', 'Opera Software', 'Opera Stable'));
    pts.operaGX.push(path.join(home, 'AppData', 'Roaming', 'Opera Software', 'Opera GX Stable'));
  } else if (p === 'darwin') {
    pts.chrome.push(path.join(home, 'Library', 'Application Support', 'Google', 'Chrome'));
    pts.edge.push(path.join(home, 'Library', 'Application Support', 'Microsoft Edge'));
    pts.firefox.push(path.join(home, 'Library', 'Application Support', 'Firefox', 'Profiles'));
    pts.opera.push(path.join(home, 'Library', 'Application Support', 'com.operasoftware.Opera'));
    pts.operaGX.push(path.join(home, 'Library', 'Application Support', 'com.operasoftware.OperaGx'));
    pts.safari.push(path.join(home, 'Library', 'Safari'));
  } else if (p === 'linux') {
    pts.chrome.push(path.join(home, '.config', 'google-chrome'));
    pts.edge.push(path.join(home, '.config', 'microsoft-edge'));
    pts.firefox.push(path.join(home, '.mozilla', 'firefox'));
    pts.opera.push(path.join(home, '.config', 'opera'));
    pts.operaGX.push(path.join(home, '.config', 'operagx'));
  }

  console.log('Detected browser paths to scan:\n', JSON.stringify(pts, null, 2));
  return pts;
}

async function exists(p) {
  return fs.access(p).then(() => true).catch(() => false);
}

async function scanForBookmarkFiles(baseDir) {
  const exts = ['', '.json', '.jsonlz4', '.bak', '.sqlite', '.db', '.html', '.htm', '.csv', '.xml', '.xbel', '.plist', '.url'];
  const candidates = new Set();

  async function inspect(dir) {
    console.log(`  • Scanning: ${dir}`);
    if (!await exists(dir)) return;
    let entries;
    try { entries = await fs.readdir(dir); } catch { return; }

    for (const name of entries) {
      const full = path.join(dir, name);
      let stat;
      try { stat = await fs.stat(full); } catch { continue; }

      if (stat.isFile()) {
        if (name === 'Bookmarks' || exts.includes(path.extname(name).toLowerCase())) {
          console.log(`    ✔ Candidate file: ${full}`);
          candidates.add(full);
        }
      }
    }
  }

  await inspect(baseDir);
  await inspect(path.dirname(baseDir));
  const subdirs = (await exists(baseDir)) ? await fs.readdir(baseDir).catch(() => []) : [];
  for (const sd of subdirs) {
    await inspect(path.join(baseDir, sd));
  }

  return Array.from(candidates);
}

function uniqueId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

async function parseBookmarkFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  console.log(`→ Parsing ${filePath} (ext=${ext})`);
  let items = [];

  try {
    if (ext === '' || ext === '.json' || ext === '.bak') {
      const raw = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(raw);
      extractChromium(data.roots, items);
    } else if (ext === '.sqlite' || ext === '.db') {
      const tmp = filePath + '_temp';
      await fs.copyFile(filePath, tmp);
      const db = new sqlite3.Database(tmp);
      const all = promisify(db.all.bind(db));
      const rows = await all(`
        SELECT b.title, p.url
        FROM moz_bookmarks b
        JOIN moz_places p ON b.fk = p.id
        WHERE LOWER(b.title) LIKE '%game%' OR LOWER(b.title) LIKE '%games%'
      `);
      rows.forEach(r => items.push({ id: uniqueId(), name: r.title, url: r.url, icon: null }));
      db.close();
      await fs.unlink(tmp).catch(() => {});
    } else if (ext === '.plist' && plist) {
      const xml = await fs.readFile(filePath, 'utf8');
      const data = plist.parse(xml);
      recursePlist(data.Children, items);
    }
  } catch (e) {
    console.error(`   ⚠ Failed to parse ${filePath}:`, e.message);
  }

  allBookmarks.push(...items);
}

// Chromium-based bookmarks inside "Games" folders only
function extractChromium(node, acc, inGamesFolder = false) {
  if (Array.isArray(node)) {
    node.forEach(n => extractChromium(n, acc, inGamesFolder));
  } else if (node && typeof node === 'object') {
    if (node.type === 'folder' && /^(games?)$/i.test(node.name)) {
      if (Array.isArray(node.children)) {
        node.children.forEach(child => extractChromium(child, acc, true));
      }
      return;
    }

    if (inGamesFolder && node.type === 'url') {
      acc.push({ id: uniqueId(), name: node.name, url: node.url, icon: null });
    }

    if (node.children) {
      node.children.forEach(child => extractChromium(child, acc, inGamesFolder));
    } else {
      Object.values(node).forEach(child => extractChromium(child, acc, inGamesFolder));
    }
  }
}

// Safari bookmarks inside "Games" folders only
function recursePlist(nodes, acc, inGamesFolder = false) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    const isGamesFolder = node.Title && /^(games?)$/i.test(node.Title);
    const nowInGamesFolder = inGamesFolder || isGamesFolder;

    if (nowInGamesFolder && node.WWWebBookmarkType === 'WebBookmarkTypeLeaf') {
      acc.push({ id: uniqueId(), name: node.URIDictionary?.title, url: node.URLString, icon: null });
    }

    if (Array.isArray(node.Children)) {
      recursePlist(node.Children, acc, nowInGamesFolder);
    }
  }
}

(async function main() {
  console.log('\n=== Bookmark Scanner Start ===');
  const bp = getBrowserPaths();
  const browsers = Object.entries(bp);

  for (const [name, dirs] of browsers) {
    for (const dir of dirs) {
      console.log(`\n-- Scanning browser: ${name} -- Base path: ${dir}`);
      if (!await exists(dir)) {
        console.log(`   ✕ Path not found: ${dir}`);
        continue;
      }
      const files = await scanForBookmarkFiles(dir);
      if (files.length === 0) {
        console.log(`   ⚠ No bookmark files under ${dir}`);
        continue;
      }
      for (const file of files) {
        await parseBookmarkFile(file);
      }
    }
  }

  const outDir = path.join(__dirname, 'booked-results');
  if (!await exists(outDir)) {
    await fs.mkdir(outDir);
    console.log(`\nCreated results directory: ${outDir}`);
  }

  // Deduplicate bookmarks based on name + url
  const deduped = Array.from(
    new Map(allBookmarks.map(b => [`${b.name}|${b.url}`, b])).values()
  );

  if (deduped.length > 0) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '');
    const outFile = path.join(outDir, `game_bookmarks_${stamp}.json`);
    await fs.writeFile(outFile, JSON.stringify(deduped, null, 2), 'utf8');
    console.log(`\n✨ Saved ${deduped.length} unique bookmarks to:\n   ${outFile}`);
  } else {
    console.log('\n⚠ No game‑related bookmarks were found.');
  }

  console.log('\n=== Done ===\n');
})();
