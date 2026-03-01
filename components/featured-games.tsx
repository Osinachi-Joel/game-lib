"use client"

import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"
import { motion, Variants } from "framer-motion"

const games = [
  {
    title: "Stellar Odyssey",
    genre: "Sci-Fi RPG",
    image: "/next.svg",
  },
  {
    title: "Dragon Realm",
    genre: "Fantasy Action",
    image: "/next.svg",
  },
  {
    title: "Neon District",
    genre: "Cyberpunk",
    image: "/next.svg",
  },
  {
    title: "Last Frontier",
    genre: "Survival",
    image: "/next.svg",
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function FeaturedGames() {
  return (
    <section className="relative py-24">
      {/* Subtle background separation */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header row */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Featured Games
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Your most played and recently added titles
            </p>
          </div>
          <a
            href="#"
            className="group hidden items-center gap-1 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-red-600 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Games grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {games.map((game) => (
            <motion.div
              key={game.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 transition-all duration-300 hover:border-red-600/30 hover:shadow-xl hover:shadow-red-600/5"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800 flex items-center justify-center p-8">
                <Image
                  src={game.image}
                  alt={`${game.title} game cover`}
                  fill
                  className="object-contain p-12 transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20"
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                    Launch
                  </motion.button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white">
                  {game.title}
                </h3>
                <span className="mt-2 inline-block rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-medium text-red-500">
                  {game.genre}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
