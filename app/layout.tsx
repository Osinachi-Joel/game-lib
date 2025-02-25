"use client"
import React from "react"
import { useEffect } from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

const sidebarItems = [
  { name: "All Games", icon: "🎮", href: "/" },
  { name: "Favorites", icon: "⭐", href: "/favorites" },
  { name: "Recently Played", icon: "🕒", href: "/recently-played" },
  { name: "Categories", icon: "📁", href: "/categories" },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 bg-white/10 shadow-[0_2px_8px_0_rgba(31,38,135,0.37)] backdrop-blur-[5.5px] rounded-lg border border-white/20">
          <div className="flex-shrink-0 px-4">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Logo
            </Link>
          </div>
          <div className="hidden md:block flex-grow">
            <div className="flex justify-center items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden pr-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function SidebarComponent({ onCollapsedChange }: { onCollapsedChange: (collapsed: boolean) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    onCollapsedChange(isCollapsed)
  }, [isCollapsed, onCollapsedChange])

  return (
    <SidebarProvider>
      <Sidebar className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <SidebarHeader className="flex justify-between items-center px-4 py-3">
          <h2 className={`text-lg font-semibold tracking-tight transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Game Library
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-200 rounded-lg dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        </SidebarHeader>
        <SidebarContent className="bg-green-200">
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.name}>
                  <Link href={item.href}>
                    <SidebarMenuButton 
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} 
                      ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/5'}`}
                    >
                      <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-2'}`}>{item.icon}</span>
                      <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        {item.name}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 h-[calc(100vh-57px)]">
              <aside className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'} border-r`}>
                <SidebarComponent onCollapsedChange={setIsSidebarCollapsed} />
              </aside>
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
