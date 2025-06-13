"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface Game {
  id: number
  name: string
  icon: string
  url: string
}

interface AddGameProps {
  onAddGame: (game: Game) => void
}

export function AddGame({ onAddGame }: AddGameProps) {
  const [open, setOpen] = useState(false)
  const [gameName, setGameName] = useState("")
  const [gameUrl, setGameUrl] = useState("")

  const handleAddGame = () => {
    const newGame: Game = {
      id: Math.floor(Date.now() / 1000),
      name: gameName || "New Game",
      icon: "/placeholder.svg?height=64&width=64",
      url: gameUrl
    }
    onAddGame(newGame)
    setOpen(false)
    setGameName("")
    setGameUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#A4031F] text-[#FDF0D5] hover:bg-[#A4031F]/80 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <label htmlFor="name" className="min-w-[80px]">
              Name
            </label>
            <Input
              id="name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="url" className="min-w-[80px]">
              URL
            </label>
            <Input
              id="url"
              value={gameUrl}
              onChange={(e) => setGameUrl(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddGame}>Add Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>)
}