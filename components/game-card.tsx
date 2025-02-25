import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

interface GameCardProps {
  name: string
  icon: string
}

export function GameCard({ name, icon }: GameCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-2">
          <Image src={icon || "/placeholder.svg"} alt={name} fill className="object-cover rounded-md" />
        </div>
        <h3 className="font-semibold text-sm truncate">{name}</h3>
      </CardContent>
    </Card>
  )
}
