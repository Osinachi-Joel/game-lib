"use client"

import { Gamepad2, Clock, FolderOpen } from "lucide-react"
import { motion, Variants } from "framer-motion"

const stats = [
  {
    icon: Gamepad2,
    value: "1,247",
    label: "Total Games",
  },
  {
    icon: Clock,
    value: "2 min ago",
    label: "Last Scanned",
  },
  {
    icon: FolderOpen,
    value: "34",
    label: "Active Categories",
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants: Variants = {
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

export function Stats() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: "rgba(220, 38, 38, 0.3)" }}
              className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-red-600/5"
            >
              <stat.icon className="mb-4 h-5 w-5 text-red-600 transition-transform duration-200 group-hover:scale-110" />
              <p className="text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
