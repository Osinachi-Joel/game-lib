"use client"

import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { GhostIcon } from "./ui/ghost-icon"
import { AddGame } from "./utility/add-game"
import { ScanBookmarks } from "./utility/scan-bookmarks"

interface Game {
  id: string
  name: string
  icon: string
  url: string
}

interface EmptyLibraryStateProps {
  onAddGame: (game: Game) => Promise<{ success?: boolean; error?: string }>
  onScanComplete: () => void
  isAddingGame: boolean
}

export function EmptyLibraryState({ onAddGame, onScanComplete, isAddingGame }: EmptyLibraryStateProps) {
  return (
    <div className="flex-grow flex items-center justify-center px-4 relative py-20">
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
      
      <div className="max-w-2xl w-full text-center z-10">
        <div className="relative inline-block mb-12">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative bg-zinc-800/50 p-12 rounded-[3rem] backdrop-blur-sm border border-white/10 shadow-2xl"
          >
            <GhostIcon className="w-48 h-48 text-zinc-600 opacity-80" />
          </motion.div>
          
          {/* Decorative glowing blobs */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-red-600/20 rounded-full blur-xl animate-pulse [animation-delay:700ms]" />
          <div className="absolute top-1/2 -left-12 w-6 h-6 bg-emerald-500/20 rounded-full blur-xl animate-pulse [animation-delay:1000ms]" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">
          Your library is a <span className="text-red-600 italic">ghost town</span>
        </h2>
        
        <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          It looks like you haven&apos;t added any adventures yet. Please add games manually or scan your bookmarks to get started.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AddGame 
            onAddGame={onAddGame} 
            isLoading={isAddingGame}
            trigger={
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
              >
                <Plus className="h-5 w-5" />
                Add Game Manually
              </motion.button>
            }
          />
          
          <ScanBookmarks 
            onScanComplete={onScanComplete}
            trigger={
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
              >
                <Search className="h-5 w-5" />
                Scan Bookmarks
              </motion.button>
            }
          />
        </div>
      </div>
    </div>
  )
}
