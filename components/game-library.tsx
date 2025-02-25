"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { GameCard } from "./game-card"
import bookmarkData from "../bookmark-edit.json"

const initialGames = bookmarkData.map((game) => ({
  id: game.add_date,
  name: game.title,
  icon: "/placeholder.svg?height=64&width=64",
  url: game.url
}))

export function GameLibrary() {
  const [games, setGames] = useState(initialGames)

  const addGame = () => {
    const newGame = {
      id: Math.floor(Date.now() / 1000),
      name: `New Game`,
      icon: "/placeholder.svg?height=64&width=64",
      url: ""
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
            <GameCard key={game.id} name={game.name} icon={game.icon} url={game.url} />
          ))}
        </div>
      </main>
    </div>
  )
}
