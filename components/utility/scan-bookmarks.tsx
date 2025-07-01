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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#03a474] text-[#FDF0D5] hover:bg-[#03a474]/80 cursor-pointer"
        >
          <Globe className="h-4 w-4" />Scan
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
  )
}