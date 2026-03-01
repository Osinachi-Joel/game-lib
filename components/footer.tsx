export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-12">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span className="font-semibold text-white">Game</span>
          <span className="font-semibold text-red-600">Lib</span>
          <span className="ml-2">{"— Your collection, unified."}</span>
        </div>
        <p className="text-xs text-zinc-500">
          {"Built with precision. Designed for gamers."}
        </p>
      </div>
    </footer>
  )
}
