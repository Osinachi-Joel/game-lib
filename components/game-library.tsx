"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GameCard } from "./game-card"
import { AddGame } from "./utility/add-game"
import { ScanBookmarks } from "./utility/scan-bookmarks"

interface Game {
  id: number
  name: string
  icon: string
  url: string
}

export function GameLibrary() {
  const [games, setGames] = useState<Game[]>([])
  const [scannedGames, setScannedGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    import("../bookmark-edit.json").then((data) => {
      setGames(
        (data.default as { id: number; name: string; icon: string | null; url: string }[]).map((game) => ({
          id: game.id,
          name: game.name,
          icon: game.icon || "/placeholder.svg?height=64&width=64",
          url: game.url,
        }))
      )
    }).catch((error) => {
      console.error("Failed to load bookmark-edit.json:", error)
    })
  }, [])

  const handleAddGame = (newGame: Game) => {
    setGames((prev: Game[]) => [...prev, newGame])
  }

  const handleScanComplete = (games: Game[]) => {
    setScannedGames(games)
  }

  return (
    <div className="flex-1 bg-gray-900 overflow-auto">
      <main className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-[#E4E4E4]">All Games</h1>
              <p className="text-gray-400">Distractions for your delight - AH</p>
            </div>

            <div className="flex gap-2 items-center">
              <AddGame onAddGame={handleAddGame} />
              <ScanBookmarks onScanComplete={handleScanComplete} />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-1/6 bg-black/20 border-gray-800 text-white placeholder-gray-400 focus:ring-[#A4031F] focus:border-[#A4031F]"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {games.filter(game =>
              game.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((game) => (
              <GameCard key={game.id} name={game.name} icon={game.icon} url={game.url} />
            ))}
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#E4E4E4] mb-4">Scanned Games</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {scannedGames.map((game) => (
                <GameCard key={game.id} name={game.name} icon={game.icon} url={game.url} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
