"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameCard } from "./game-card"

interface Game {
  id: number
  name: string
  icon: string
  url: string
}

export function GameLibrary() {
  const [games, setGames] = useState<Game[]>([])

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
    })
  }, [])

  const addGame = () => {
    setGames((prev: Game[]) => [
      ...prev,
      {
        id: Math.floor(Date.now() / 1000),
        name: "New Game",
        icon: "/placeholder.svg?height=64&width=64",
        url: ""
      }
    ])
  }

  return (
    <div className="flex-1 bg-gray-900 overflow-auto">
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[#E4E4E4]">All Games</h1>
            <p className="text-gray-400">Distractions for your delight - AH</p>
          </div>
          <Button 
            onClick={addGame}
            className="bg-[#A4031F] text-[#FDF0D5] hover:bg-[#A4031F]/80"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Game
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} name={game.name} icon={game.icon} url={game.url} />
          ))}
        </div>
      </main>
    </div>
  )
}
