"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GameCard } from "./game-card"
import { AddGame } from "./utility/add-game"
import { ScanBookmarks } from "./utility/scan-bookmarks"
import { Spinner } from "./ui/spinner"

interface Game {
  id: string
  name: string
  icon: string
  url: string
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
        // Don't throw, just return a special value
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
              <AddGame onAddGame={handleAddGame} isLoading={isAddingGame} />
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
              className="pl-10 w-1/6 bg-white/20 border-gray-800 text-white placeholder-gray-400 focus:ring-[#A4031F] focus:border-[#A4031F]"
            />
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner />
              </div>
            ) : scannedGames.length === 0 ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center text-gray-400">
                  <p>No games found in the database.</p>
                  <p>Please add games manually or scan your bookmarks to get started.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {scannedGames.filter(game =>
                  game.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((game) => (
                  <GameCard key={game.id} id={parseInt(game.id)} name={game.name} icon={game.icon} url={game.url} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
