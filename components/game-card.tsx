import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

interface GameCardProps {
  name: string
  icon: string
  url: string
}

export function GameCard({ name, icon, url }: GameCardProps) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="aspect-square relative mb-2">
            <Image src={icon || "/placeholder.svg"} alt={name} fill className="object-cover rounded-md" />
          </div>
          <h3 className="font-semibold text-sm truncate">{name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
