import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { SquarePen } from "lucide-react"
import { toast } from "sonner"

interface EditGameDialogProps {
  id: number
  name: string
  url: string
  onUpdated?: (newName: string, newUrl: string) => void
}

export function EditGameDialog({ id, name, url, onUpdated }: EditGameDialogProps) {
  const [open, setOpen] = useState(false)
  const [gameName, setGameName] = useState(name)
  const [gameUrl, setGameUrl] = useState(url)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/update-game", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: gameName, url: gameUrl }),
      })
      if (!response.ok) {
        throw new Error("Failed to update game")
      }
      if (onUpdated) onUpdated(gameName, gameUrl)
      toast.success("Game updated successfully!")
      setOpen(false)
    } catch {
      setError("Failed to update game. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" aria-label="Edit game">
          <SquarePen className="w-4 h-4 cursor-pointer hover:text-blue-400 transition" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span>Game Name</span>
            <input
              className="border rounded px-2 py-1"
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Game URL</span>
            <input
              className="border rounded px-2 py-1"
              value={gameUrl}
              onChange={e => setGameUrl(e.target.value)}
              required
            />
          </label>
          <DialogFooter>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            <DialogClose asChild>
              <button type="button" className="px-4 py-2 rounded border">Cancel</button>
            </DialogClose>
          </DialogFooter>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
