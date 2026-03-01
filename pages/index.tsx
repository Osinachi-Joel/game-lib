import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { FeaturedGames } from "@/components/featured-games"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <main>
        <Hero />
        <Stats />
        <FeaturedGames />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
