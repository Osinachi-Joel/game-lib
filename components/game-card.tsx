"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Clock, Eye } from "lucide-react"

interface GameCardProps {
  name: string
  icon?: string
  url: string
}

interface GameData {
  background_image: string
  released?: string
  ratings_count?: number
}

export function GameCard({ name, icon = "/placeholder.svg?height=64&width=64", url }: GameCardProps) {
  const [gameData, setGameData] = useState<GameData | null>(null)

  useEffect(() => {
    const fetchGameData = async () => {
      const cachedData = localStorage.getItem(`game-${name}`)
      if (cachedData) {
        setGameData(JSON.parse(cachedData))
        return
      }

      try {
        const response = await fetch(`/api/games?search=${encodeURIComponent(name)}`)
        const data = await response.json()
        if (data.data && data.data.results && data.data.results.length > 0) {
          const gameResult = data.data.results[0]
          setGameData(gameResult)
          localStorage.setItem(`game-${name}`, JSON.stringify(gameResult))
        }
      } catch (error) {
        console.error("Error fetching game data:", error)
      }
    }

    fetchGameData()
  }, [name])

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Card className="p-0 group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-black/90 border-0 hover:ring-2 hover:ring-red-500/20">
        <div className="aspect-[2/3] w-full relative">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={gameData?.background_image || icon}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover w-full h-full group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 brightness-70"
              style={{ objectPosition: "center" }}
              priority={false}
            />
          </div>

          {/* Gradients for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3
              className="font-bold text-2xl text-white drop-shadow-lg tracking-wider mb-2 font-cinematic truncate"
              title={name}
            >
              {name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/80">
              {gameData?.released && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(gameData.released).getFullYear()}</span>
                </div>
              )}
              {gameData?.ratings_count && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{gameData.ratings_count.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
