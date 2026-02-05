"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Game {
  id: number
  name: string
  icon: string
  url: string
}

interface ScanBookmarksProps {
  onScanComplete: () => void
}

export function ScanBookmarks({ onScanComplete }: ScanBookmarksProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteFromDb, setDeleteFromDb] = useState(false)

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

  return (
    <div className="flex gap-2">
      {/* Scan Button & Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-[#03a474] text-[#FDF0D5] hover:bg-[#03a474]/80 cursor-pointer"
          >
            <Globe className="h-4 w-4 mr-2" />Scan
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prepare Your Bookmarks</DialogTitle>
            <DialogDescription className="pt-2 space-y-4">
              <p>To ensure a successful scan of your game bookmarks, please follow these steps:</p>

              <ol className="list-disc list-inside space-y-2">
                <li>Open your browser&apos;s bookmark manager</li>
                <li>Create a folder named &quot;Games&quot;</li>
                <li>Move all your game bookmarks into this folder</li>
                <li>Click the Scan button below to begin</li>
              </ol>

              <p>This will help us locate and organize your game collection efficiently.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleScan}
              className="bg-[#03a474] text-[#FDF0D5] hover:bg-[#03a474]/80 flex items-center gap-2"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Spinner />
                </>
              ) : (
                'Start Scan'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete History Button & Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setDeleteFromDb(false)} // Reset checkbox on open
          >
            Delete History
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scan History</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete all scanned bookmark files? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 py-4">
            <input
              type="checkbox"
              id="deleteFromDb"
              checked={deleteFromDb}
              onChange={(e) => setDeleteFromDb(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label
              htmlFor="deleteFromDb"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Also delete all games from the database
            </label>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteHistory}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : 'Delete Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}