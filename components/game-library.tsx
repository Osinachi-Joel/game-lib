"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { GameCard } from "./game-card"

const initialGames = [
  { id: 1, name: "The Legend of Zelda", icon: "/placeholder.svg?height=64&width=64" },
  { id: 2, name: "Super Mario Odyssey", icon: "/placeholder.svg?height=64&width=64" },
  { id: 3, name: "Elden Ring", icon: "/placeholder.svg?height=64&width=64" },
  { id: 4, name: "Stardew Valley", icon: "/placeholder.svg?height=64&width=64" },
  { id: 5, name: "Hades", icon: "/placeholder.svg?height=64&width=64" },
  { id: 6, name: "Minecraft", icon: "/placeholder.svg?height=64&width=64" },
]

export function GameLibrary() {
  const [games, setGames] = useState(initialGames)

  const addGame = () => {
    const newGame = {
      id: games.length + 1,
      name: `New Game ${games.length + 1}`,
      icon: "/placeholder.svg?height=64&width=64",
    }
    setGames([...games, newGame])
  }

  return (
    <div className="flex-1 bg-red-100 overflow-auto pt-28">
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Games</h1>
          <Button onClick={addGame}>
            <Plus className="mr-2 h-4 w-4" /> Add Game
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} name={game.name} icon={game.icon} />
          ))}
        </div>
      </main>
    </div>
  )
}
