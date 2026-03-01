import { BarChart3, TrendingUp, Clock, Target } from "lucide-react"

export default function Insights() {
  const insightCards = [
    { title: "Most Played", value: "24h", label: "Stellar Odyssey", icon: TrendingUp },
    { title: "Average Session", value: "1.5h", label: "+12% from last week", icon: Clock },
    { title: "Collection Progress", value: "68%", label: "12 games left to finish", icon: Target },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="text-crimson" />
          Library Insights
        </h1>
        <p className="text-muted-foreground mt-2">Deep dive into your gaming habits and collection stats.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {insightCards.map((card) => (
          <div key={card.title} className="p-6 rounded-2xl border border-border/50 bg-surface-glass backdrop-blur-sm">
            <card.icon className="h-5 w-5 text-crimson mb-4" />
            <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
            <p className="text-3xl font-bold text-foreground my-1">{card.value}</p>
            <p className="text-xs text-crimson">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 bg-surface-glass p-12 text-center">
        <p className="text-muted-foreground italic">Detailed activity charts and genre distributions are coming soon.</p>
      </div>
    </div>
  )
}
