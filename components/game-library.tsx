"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GameCard } from "./game-card"
import { AddGame } from "./utility/add-game"
import { ScanBookmarks } from "./utility/scan-bookmarks"
import { EmptyLibraryState } from "./empty-library-state"
import { Spinner } from "./ui/spinner"
import { motion, AnimatePresence } from "framer-motion"

interface Game {
  _id?: string;
  id: string;
  name: string;
  icon: string;
  url: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function GameLibrary() {
  const [scannedGames, setScannedGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingGame, setIsAddingGame] = useState(false)

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/get-games')
        if (!response.ok) {
          console.error('Failed to fetch bookmarks')
          setScannedGames([])
          return
        }
        const games = await response.json()
        setScannedGames(games)
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
        setScannedGames([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGames()
  }, [])


  const handleAddGame = async (newGame: Game) => {
    setIsAddingGame(true)
    try {
      const gameWithId = {
        ...newGame,
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 5)
      }
      const response = await fetch('/api/add-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameWithId),
      })

      if (response.status === 409) {
        return { error: 'DUPLICATE_GAME' }
      }
      if (!response.ok) {
        throw new Error('Failed to add game')
      }

      setScannedGames(prevGames => [...prevGames, gameWithId])
      return { success: true }
    } catch (error) {
      console.error('Error adding game:', error)
      throw error
    } finally {
      setIsAddingGame(false)
    }
  }

  const handleScanComplete = async () => {
    try {
      const response = await fetch('/api/get-games');
      if (!response.ok) {
        console.error('Failed to fetch games');
        setScannedGames([]);
        return;
      }
      const games = await response.json();
      setScannedGames(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      setScannedGames([]);
    }
  }

  const handleDeleteGame = (_id?: string, id?: number) => {
    setScannedGames(prevGames => prevGames.filter(game => {
      if (_id && game._id) return game._id !== _id;
      if (id) return parseInt(game.id) !== id;
      return true;
    }));
  };

  const filteredGames = scannedGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
      >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">All Games</h1>
              <p className="text-zinc-400">Distractions for your delight - AH</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {scannedGames.length > 0 ? (
                <>
                  <AddGame onAddGame={handleAddGame} isLoading={isAddingGame} />
                  <ScanBookmarks onScanComplete={handleScanComplete} />
                </>
              ) : (
                /* Top buttons are hidden when library is empty to focus on center actions */
                null
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {scannedGames.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative max-w-md"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:ring-red-600 focus:border-red-600"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[40vh]">
                <Spinner />
              </div>
            ) : scannedGames.length === 0 ? (
              <EmptyLibraryState 
                onAddGame={handleAddGame} 
                onScanComplete={handleScanComplete} 
                isAddingGame={isAddingGame} 
              />
            ) : filteredGames.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center min-h-[40vh]"
              >
                <div className="text-center text-zinc-400">
                  <p className="text-lg">No matches found for &quot;{searchQuery}&quot;.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredGames.map((game) => (
                    <motion.div key={game.id} variants={item} layout>
                      <GameCard
                        _id={game._id}
                        id={parseInt(game.id)}
                        name={game.name}
                        icon={game.icon}
                        url={game.url}
                        onDelete={(_id?: string, id?: number) => handleDeleteGame(_id, id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    )
}
