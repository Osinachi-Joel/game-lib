"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setIsCollapsed((prev) => !prev)
    }, [isMobile, setOpenMobile])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = isCollapsed ? "collapsed" : "expanded"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const sidebarItems = [
  { name: "All Games", icon: "🎮", href: "/" },
  { name: "Favorites", icon: "⭐", href: "/favorites" },
  { name: "Recently Played", icon: "🕒", href: "/recently-played" },
  { name: "Categories", icon: "📁", href: "/categories" },
]

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const pathname = usePathname()
  const { isMobile, state, openMobile, setOpenMobile, toggleSidebar } = useSidebar()

  if (isMobile) {
    return (
      <>
        <Button
          onClick={() => setOpenMobile(true)}
          variant="ghost"
          className="fixed top-4 left-4 z-50 md:hidden"
        >
          <Menu className="h-5 w-5 text-[#8CEAF4]" />
        </Button>
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-[#0E1525] p-0 text-[#8CEAF4]"
            style={
              {
                "--sidebar-width": "18rem",
              } as React.CSSProperties
            }
            side="left"
          >
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#8CEAF4]/20">
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Image src="/icon.png" alt="Game Library" width={32} height={32} />
                  <span className="text-[#8CEAF4] font-semibold">Game Library</span>
                </motion.div>
              </div>

              <nav className="flex-1 p-2">
                <ul className="space-y-1">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              isActive
                                ? "bg-[#18181B] text-[#8CEAF4]"
                                : "text-[#8CEAF4]/70 hover:bg-[#18181B]/50"
                            }`}
                          >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                          </motion.div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-screen shrink-0 md:w-[var(--sidebar-width)] transition-all duration-300",
        state === "collapsed" && "md:w-[var(--sidebar-width-icon)]",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "fixed inset-y-0 z-40 flex h-full transition-all duration-300",
          "bg-[#0E1525] border-r border-[#8CEAF4]/20"
        )}
        animate={{
          width: state === "collapsed" ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-[#8CEAF4]/20">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: state === "collapsed" ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Image src="/icon.png" alt="Game Library" width={32} height={32} />
              <span className="text-[#8CEAF4] font-semibold">Game Library</span>
            </motion.div>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              {state === "collapsed" ? (
                <Menu className="h-5 w-5 text-[#8CEAF4]" />
              ) : (
                <X className="h-5 w-5 text-[#8CEAF4]" />
              )}
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-2">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#18181B] text-[#8CEAF4]"
                            : "text-[#8CEAF4]/70 hover:bg-[#18181B]/50"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <motion.span
                          initial={{ opacity: 1 }}
                          animate={{ opacity: state === "collapsed" ? 0 : 1 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      </motion.div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </motion.div>
    </div>
  )
})
Sidebar.displayName = "Sidebar"

export {
  Sidebar,
  SidebarProvider,
  useSidebar,
}
