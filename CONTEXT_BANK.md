# Game Library - Context Bank

## Project Overview
**Game Library** is a personal game management application designed to scan, organize, and launch games from various platforms (Steam, Epic, Web keys, etc.) via browser bookmarks and manual entry. It features a modern, responsive UI built with Next.js and stores data in MongoDB.

## Technology Stack
- **Framework**: [Next.js](https://nextjs.org/) (v15.3.0, Pages Router)
- **Language**: TypeScript / JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), `clsx`, `tailwind-merge`
- **Database**: [MongoDB](https://www.mongodb.com/) (using native `mongodb` driver, not Mongoose schemas)
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) (Dialog, Slot)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Tabler Icons](https://tabler.io/icons)
  - [Sonner](https://sonner.emilkowal.ski/) (Toasts)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utilities**: `sqlite3` and `plist` for parsing browser data.

## Directory Structure
- **`app/`**: (Likely unused or minimal if using Pages router, check content).
- **`components/`**: Reusable React components.
  - **`ui/`**: Basic UI building blocks (buttons, inputs, etc.).
  - **`utility/`**: Helper components.
  - **`game-card.tsx`**: Display component for individual games.
  - **`game-library.tsx`**: Main grid view of the library.
- **`lib/`**: Backend utilities.
  - **`mongodb.ts`**: Database connection logic (singleton pattern).
  - **`api-utils.ts`**: Error handling and response helpers.
- **`pages/`**: Application routes.
  - **`api/`**: Backend API endpoints (`add-game`, `get-games`, etc.).
  - **`index.tsx`**: Main entry point.
- **`public/`**: Static assets.
- **`styles/`**: Global styles (`globals.css`).
- **`types/`**: (Implied) TypeScript definitions (e.g., `next-env.d.ts`).
- **`bookmarkScanner.js`**: Node.js script to scan local browser directories for game bookmarks.

## Architecture & Key Workflows

### 1. Game Data Management
- **Manual Entry**: Users can add games via a POST request to `/api/add-game`.
- **Database**: Data is stored in the `games` collection in the `game-library` database.
  - **Schema** (Implicit):
    ```typescript
    interface Game {
      id: string;
      name: string;
      url: string;
      icon: string; // URL or base64
      createdAt: Date;
    }
    ```
- **Uniqueness**: Games are identified by URL to prevent duplicates.

### 2. Bookmark Scanning
- **Logic**: `bookmarkScanner.js` detects installed browsers (Chrome, Edge, Firefox, Opera, Safari) on Windows, macOS, and Linux.
- **Process**:
  1.  Locates browser data directories.
  2.  Parses bookmark files (JSON, SQLite, Plist, HTML).
  3.  Filters for folders named "Games" or "Game".
  4.  Extracts URLs and Titles.
  5.  Deduplicates and saves results to `booked-results/`.
- **Integration**: The frontend likely triggers this via an API route (`pages/api/scan-bookmarks.ts`) or it's run as a standalone CLI tool.

### 3. Frontend Architecture
- **Theme**: Dark mode enabled/supported (via `next-themes` implied by dependencies).
- **State Management**: React local state (useState/useEffect) likely used for fetching games.
- **Styling**: Utility-first approach using Tailwind.

## Configuration
- **Environment Variables**:
  - `MONGODB_URI`: Connection string for MongoDB.
- **Scripts**:
  - `dev`: Runs Next.js dev server.
  - `build`: Builds the Next.js app.
  - `start`: Starts production server.

## Key Files
- `lib/mongodb.ts`: Handles caching of the MongoDB client to prevent connection exhaustion in serverless/dev environments.
- `bookmarkScanner.js`: Complex logic for cross-platform browser path detection and file parsing.
