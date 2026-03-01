/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Plus, Gamepad2, Gamepad, Link as LinkIcon, Info } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { motion, Variants } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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
  trigger?: React.ReactNode
}

const spanVariants: Variants = {
  initial: { width: 0, opacity: 0, marginLeft: 0 },
  hover: { 
    width: "auto", 
    opacity: 1, 
    marginLeft: 8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

/**
 * AddGame component allows users to add a new game with validation and accessibility.
 */
export function AddGame({ onAddGame, isLoading, trigger }: AddGameProps) {
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
        {trigger || (
          <motion.button
            className="flex items-center justify-center bg-blue-600 text-white rounded-md h-12 min-w-[48px] px-3.5 transition-colors hover:bg-blue-700 shadow-lg shadow-blue-600/20 outline-none overflow-hidden"
            whileHover="hover"
            initial="initial"
            aria-label="Add a new game"
          >
            <Plus className="h-5 w-5 shrink-0" aria-hidden="true" />
            <motion.span
              variants={spanVariants}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              Add Game
            </motion.span>
          </motion.button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 bg-[#1e293b] border-slate-800 text-white overflow-hidden sm:top-[15%] sm:translate-y-0">
        <div className="px-6 pt-6 pb-2 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-2">
              <Gamepad2 className="h-5 w-5 text-blue-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">Add New Game</DialogTitle>
            <p className="text-sm text-slate-400 leading-relaxed">Expand your digital library manually.</p>
          </div>
        </div>

        <form 
          className="px-6 py-4 space-y-5" 
          onSubmit={(e) => { e.preventDefault(); handleAddGame(); }}
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-300" htmlFor="game-name">
              Game Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Gamepad className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <Input
                id="game-name"
                placeholder="e.g. Cyberpunk 2077"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="block w-full pl-11 bg-[#0f172a]/50 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-300" htmlFor="game-url">
              Game URL
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <Input
                id="game-url"
                type="url"
                placeholder="https://fitgirl-repacks.site/..."
                value={gameUrl}
                onChange={(e) => setGameUrl(e.target.value)}
                className="block w-full pl-11 bg-[#0f172a]/50 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Info className="h-3.5 w-3.5 text-slate-500" />
              <p className="text-xs text-slate-500">Make sure the URL is a direct link to the game</p>
            </div>
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url}</p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {isLoading ? <Spinner /> : (
                <>
                  <span>Add Game</span>
                  <Plus className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Decorative glow */}
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-500/10 blur-[60px] pointer-events-none"></div>
      </DialogContent>
    </Dialog>
  );
}
