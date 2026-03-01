"use client"

import { Search, RefreshCw, Zap } from "lucide-react"
import { motion, Variants } from "framer-motion"

const features = [
  {
    icon: Search,
    title: "Instant Search",
    description:
      "Find any game across your entire library in milliseconds. Filter by genre, platform, or playtime.",
  },
  {
    icon: RefreshCw,
    title: "Bookmark Sync",
    description:
      "Automatically sync your bookmarks and wishlists from Steam, Epic, GOG, and other launchers.",
  },
  {
    icon: Zap,
    title: "One-Click Launch",
    description:
      "Launch any game directly from GameLib without opening its native launcher first.",
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function Features() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
            Built for Speed and Control
          </h2>
          <p className="mt-3 text-zinc-400">
            Everything you need to manage a massive game collection.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              {/* Divider on desktop */}
              {index > 0 && (
                <div className="absolute -left-4 top-0 hidden h-full w-px bg-zinc-800/40 lg:block" />
              )}

              <div className="rounded-xl p-6 transition-all duration-300 hover:bg-white/5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 transition-colors duration-200 group-hover:bg-red-600/20">
                  <feature.icon className="h-5 w-5 text-red-600 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
