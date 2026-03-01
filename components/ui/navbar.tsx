"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { Gamepad2, LayoutGrid, Home, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: Gamepad2 },
  { name: "Insights", href: "/insights", icon: BarChart3 },
]

export function Navbar() {
  const router = useRouter()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/40 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Game<span className="text-red-600">Lib</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-2">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-red-600/10 text-red-600" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-red-600" : "")} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
