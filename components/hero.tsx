"use client"

import { Gamepad2, Star, TrendingUp } from "lucide-react"
import { motion, Variants } from "framer-motion"

function MockDashboard() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-2xl shadow-red-900/5"
    >
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-600" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
        </div>
        <span className="text-xs text-zinc-500 font-mono">GameLib v2.4</span>
      </div>

      {/* Mini game cards grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { name: "Stellar Odyssey", color: "bg-red-600/20", icon: Star },
          { name: "Dragon Realm", color: "bg-red-600/10", icon: Gamepad2 },
          { name: "Neon Rush", color: "bg-red-600/15", icon: TrendingUp },
        ].map((game) => (
          <motion.div
            key={game.name}
            variants={itemVariants}
            className={`${game.color} rounded-lg border border-white/5 p-3 transition-all duration-200`}
          >
            <game.icon className="mb-2 h-5 w-5 text-red-600" />
            <p className="text-xs font-medium text-white truncate">{game.name}</p>
            <p className="text-[10px] text-zinc-400">Installed</p>
          </motion.div>
        ))}
      </div>

      {/* Stats row */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-4 rounded-lg border border-white/5 bg-black/50 px-4 py-3"
      >
        <div className="flex-1">
          <p className="text-lg font-bold text-white">247</p>
          <p className="text-[10px] text-zinc-400">Total Games</p>
        </div>
        <div className="h-8 w-px bg-zinc-800" />
        <div className="flex-1">
          <p className="text-lg font-bold text-red-600">12</p>
          <p className="text-[10px] text-zinc-400">Playing Now</p>
        </div>
        <div className="h-8 w-px bg-zinc-800" />
        <div className="flex-1">
          <p className="text-lg font-bold text-white">98%</p>
          <p className="text-[10px] text-zinc-400">Synced</p>
        </div>
      </motion.div>

      {/* Glow effect */}
      <div className="absolute -inset-1 -z-10 rounded-xl bg-red-600/5 blur-xl" />
    </motion.div>
  )
}

export function Hero() {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const
      }
    })
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-red-600/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div>
            <motion.h1 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-4xl font-bold leading-tight tracking-tight text-white text-balance lg:text-5xl xl:text-6xl"
            >
              Your Entire Collection.{" "}
              <span className="text-red-600">Perfectly Organized.</span>
            </motion.h1>
            <motion.p 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400 text-pretty"
            >
              Launch, manage, and track every game you own from one powerful
              dashboard. No more switching between launchers.
            </motion.p>
            <motion.div 
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20"
              >
                <Gamepad2 className="h-4 w-4" />
                Open Library
                <span className="absolute inset-0 rounded-lg bg-red-600 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-30" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-400 transition-all duration-200 hover:border-red-600/50 hover:text-white"
              >
                Scan Bookmarks
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column — Mock Dashboard */}
          <div className="relative">
            <MockDashboard />
          </div>
        </div>
      </div>
    </section>
  )
}
