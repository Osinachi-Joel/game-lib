/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

// Game interface with improved type for icon (can be null)
interface Game {
  id: string
  name: string
  icon: string
  url: string
}

// AddGameProps with async onAddGame and loading state
interface AddGameProps {
  onAddGame: (game: Game) => Promise<any>
  isLoading: boolean
}

/**
 * AddGame component allows users to add a new game with validation and accessibility.
 */
export function AddGame({ onAddGame, isLoading }: AddGameProps) {
  const [open, setOpen] = useState(false)
  const [gameName, setGameName] = useState("")
  const [gameUrl, setGameUrl] = useState("")
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({})

  // Validate form fields
  const validate = () => {
    const newErrors: { name?: string; url?: string } = {}
    if (!gameName.trim()) newErrors.name = "Game name is required."
    if (!gameUrl.trim()) newErrors.url = "Game URL is required."
    else if (!/^https?:\/\//.test(gameUrl)) newErrors.url = "URL must start with http:// or https://."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle adding a new game with validation and error handling
  const handleAddGame = async () => {
    if (isLoading) return
    if (!validate()) return
    const newGame: Game = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      name: gameName.trim(),
      icon: "/placeholder.svg?height=64&width=64",
      url: gameUrl.trim()
    };
    try {
      const result = await onAddGame(newGame)
      if (result && result.error === 'DUPLICATE_GAME') {
        toast.error('This game already exists!')
        return
      }
      setOpen(false)
      setGameName("")
      setGameUrl("")
      setErrors({})
      toast.success('Game added successfully!')
    } catch (error: any) {
      console.error('Error adding game:', error)
      toast.error('Failed to add game. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#A4031F] text-[#FDF0D5] hover:bg-[#A4031F]/80 cursor-pointer"
          aria-label="Add a new game"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={e => { e.preventDefault(); handleAddGame(); }}
          aria-label="Add new game form"
        >
          <div className="flex items-center gap-4">
            <label htmlFor="name" className="min-w-[80px]">
              Name
            </label>
            <Input
              id="name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="flex-1"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
            />
          </div>
          {errors.name && (
            <span id="name-error" className="text-red-500 text-xs ml-[88px]">{errors.name}</span>
          )}
          <div className="flex items-center gap-4">
            <label htmlFor="url" className="min-w-[80px]">
              URL
            </label>
            <Input
              id="url"
              value={gameUrl}
              onChange={(e) => setGameUrl(e.target.value)}
              className="flex-1"
              aria-required="true"
              aria-invalid={!!errors.url}
              aria-describedby="url-error"
              type="url"
            />
          </div>
          {errors.url && (
            <span id="url-error" className="text-red-500 text-xs ml-[88px]">{errors.url}</span>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isLoading} aria-disabled={isLoading} aria-busy={isLoading} className="bg-[#A4031F] text-[#FDF0D5] hover:bg-[#A4031F]/80">
              {isLoading ? <Spinner /> : 'Add Game'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
