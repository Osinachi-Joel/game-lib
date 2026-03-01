"use client"

import { useState } from "react"
import { Globe, Trash2, FolderPlus, MousePointerClick, Radar, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ScanBookmarksProps {
  onScanComplete: () => void
  trigger?: React.ReactNode
}

const spanVariants = {
  initial: { width: 0, opacity: 0, marginLeft: 0 },
  hover: { 
    width: "auto", 
    opacity: 1, 
    marginLeft: 8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

export function ScanBookmarks({ onScanComplete, trigger }: ScanBookmarksProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteFromDb, setDeleteFromDb] = useState(false)
  
  const [isScanHovered, setIsScanHovered] = useState(false)
  const [isDeleteHovered, setIsDeleteHovered] = useState(false)

  const handleScan = async () => {
    setIsScanning(true)
    try {
      const response = await fetch('/api/scan-bookmarks')
      if (!response.ok) {
        throw new Error('Failed to scan bookmarks')
      }
      await onScanComplete()
      setOpen(false)
      toast.success('Games scanned successfully!')
    } catch (error) {
      console.error('Failed to scan bookmarks:', error)
      toast.error('Failed to scan bookmarks. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleDeleteHistory = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/delete-scan-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteFromDb })
      })

      if (!response.ok) {
        throw new Error('Failed to delete history')
      }

      const data = await response.json()
      await onScanComplete()
      setDeleteDialogOpen(false)

      let message = `Deleted ${data.filesDeleted} scan files.`
      if (data.dbCleared) {
        message += ` Database cleared (${data.dbDeleted} games removed).`
      }
      toast.success(message)

    } catch (error) {
      console.error('Failed to delete history:', error)
      toast.error('Failed to delete scan history.')
    } finally {
      setIsDeleting(false)
    }
  }

  const steps = [
    {
      title: "Open Browser Manager",
      desc: "Access your browser's bookmark manager settings (Ctrl+Shift+O).",
      icon: Globe
    },
    {
      title: "Create \"Games\" Folder",
      desc: "Create a new folder specifically named Games in your bookmark bar.",
      icon: FolderPlus,
      highlight: "Games"
    },
    {
      title: "Move Your Bookmarks",
      desc: "Drag and drop all your gaming bookmarks into this new folder.",
      icon: MousePointerClick
    },
    {
      title: "Start the Scan",
      desc: "Click the button below to let GameLib organize your collection.",
      icon: Radar
    }
  ]

  return (
    <div className="flex gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <motion.button
              onMouseEnter={() => setIsScanHovered(true)}
              onMouseLeave={() => setIsScanHovered(false)}
              className="flex items-center justify-center bg-[#10b981] text-white rounded-md h-12 min-w-[48px] px-3.5 transition-colors hover:bg-[#10b981]/90 shadow-lg shadow-[#10b981]/20 outline-none overflow-hidden"
              whileHover="hover"
              initial="initial"
            >
              <Globe className="h-5 w-5 shrink-0" />
              <motion.span
                variants={spanVariants}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Scan
              </motion.span>
            </motion.button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md p-0 bg-[#1e293b] border-slate-800 text-white overflow-hidden sm:top-[15%] sm:translate-y-0">
          <div className="p-6 pb-0 flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-2">Prepare Your Bookmarks</DialogTitle>
              <DialogDescription className="text-sm text-slate-400 leading-relaxed">
                Follow these simple steps to ensure a successful scan of your game collection.
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-slate-400 group-hover:bg-[#10b981]/20 group-hover:text-[#10b981] transition-colors">
                    <step.icon className="h-5 w-5" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-800 mt-2 min-h-[24px]"></div>
                  )}
                </div>
                <div className={idx < steps.length - 1 ? "pb-6" : ""}>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {step.highlight ? (
                      <>
                        {step.desc.split(step.highlight)[0]}
                        <span className="text-[#10b981] font-mono font-bold bg-[#10b981]/10 px-1 rounded">{step.highlight}</span>
                        {step.desc.split(step.highlight)[1]}
                      </>
                    ) : step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#0f172a]/50 flex justify-between items-center border-t border-slate-800">
            <p className="text-xs text-slate-500 max-w-[180px] leading-tight">
              This helps us locate and organize your library efficiently.
            </p>
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="bg-[#10b981] hover:bg-[#10b981]/90 text-white font-bold py-6 px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2"
            >
              {isScanning ? <Spinner /> : (
                <>
                  Start Scan
                  <Rocket className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {!trigger && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              className="flex items-center justify-center bg-red-600 text-white rounded-md h-12 min-w-[48px] px-3.5 transition-colors hover:bg-red-700 shadow-lg shadow-red-600/20 outline-none overflow-hidden"
              whileHover="hover"
              initial="initial"
              onClick={() => setDeleteFromDb(false)}
            >
              <Trash2 className="h-5 w-5 shrink-0" />
              <motion.span
                variants={spanVariants}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Delete History
              </motion.span>
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e293b] border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Delete Scan History</DialogTitle>
              <DialogDescription className="pt-2 text-slate-400">
                Are you sure you want to delete all scanned bookmark files? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center space-x-2 py-4 text-white">
              <input
                type="checkbox"
                id="deleteFromDb"
                checked={deleteFromDb}
                onChange={(e) => setDeleteFromDb(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500 focus:ring-offset-slate-900"
              />
              <label
                htmlFor="deleteFromDb"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Also delete all games from the database
              </label>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="border-slate-700 hover:bg-slate-800 text-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteHistory}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? <Spinner /> : 'Delete Confirm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
