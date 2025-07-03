"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { EditGameDialog } from "@/components/utility/edit-game"
import { DeleteGameDialog } from "@/components/utility/delete-game"

interface GameCardProps {
  id: number
  name: string
  icon?: string
  url: string
}

interface GameData {
  background_image: string
  released?: string
  ratings_count?: number
}

function SkeletonCard() {
  return (
    <div className="aspect-[2/3] relative w-full h-full animate-pulse bg-gray-800 rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="h-8 w-3/4 bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-700 rounded" />
      </div>
    </div>
  )
}

export function GameCard({ id, name, icon = "/placeholder.svg?height=64&width=64", url }: GameCardProps) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [displayName, setDisplayName] = useState(name)
  const [displayUrl, setDisplayUrl] = useState(url)
  const [loading, setLoading] = useState(true)
  const [inView, setInView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const fetchGameData = async () => {
      const cachedData = localStorage.getItem(`game-${name}`)
      if (cachedData) {
        setGameData(JSON.parse(cachedData))
        setLoading(false)
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
        console.error('Error fetching game data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGameData()
  }, [name, inView])

  const handleActionClick = (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

  return (
    <Link href={displayUrl} target="_blank" rel="noopener noreferrer">
      <Card className="group p-0 relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-black/90 border-0 hover:ring-2 hover:ring-red-500/20">
        <CardContent className="p-0">
          <div ref={cardRef} className="aspect-[2/3] relative">
            {loading ? (
              <SkeletonCard />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />
                <Image 
                  src={gameData?.background_image || icon} 
                  alt={displayName}
                  fill
                  loading="lazy"
                  className="object-cover brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-500" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 
                    className="font-bold text-2xl text-white drop-shadow-lg tracking-wider mb-2 font-cinematic truncate" 
                    title={displayName}
                  >
                    {displayName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    {gameData?.released && (
                      <div className="flex items-center gap-1">
                        <Calendar  className="w-4 h-4" />
                        <span>{new Date(gameData.released).getFullYear()}</span>
                      </div>
                    )}
                    <div className="ml-auto flex items-center gap-2" onClick={handleActionClick}>
                      <EditGameDialog id={id} name={displayName} url={displayUrl} onUpdated={(newName, newUrl) => { setDisplayName(newName); setDisplayUrl(newUrl); }} />
                      <DeleteGameDialog onDelete={() => { /* TODO: handle delete */ }} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
