import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface GameCardProps {
  name: string
  icon?: string
  url: string
}

export function GameCard({ name, icon = "/placeholder.svg?height=64&width=64", url }: GameCardProps) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-[#18181B] border-[#18181B] hover:border-[#8CEAF4]/20">
        <CardContent className="p-4">
          <div className="aspect-square relative mb-2">
            <Image src={icon} alt={"icon"} fill className="object-cover rounded-md" />
          </div>
          <h3 className="font-semibold text-sm truncate text-[#8CEAF4]">{name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
