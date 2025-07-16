import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { SquarePen } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Input } from "../ui/input"

interface EditGameDialogProps {
  _id?: string;
  id: number;
  name: string;
  url: string;
  onUpdated?: (newName: string, newUrl: string) => void;
}

export function EditGameDialog({ _id, id, name, url, onUpdated }: EditGameDialogProps) {
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_id ? { _id, name: gameName, url: gameUrl } : { id, name: gameName, url: gameUrl }),
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
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span>Game Name</span>
            <Input
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Game URL</span>
            <Input
              value={gameUrl}
              onChange={e => setGameUrl(e.target.value)}
              required
            />
          </label>
          <DialogFooter>
            <Button onClick={handleSave} disabled={loading} className="cursor-pointer bg-blue-300 text-black hover:text-shadow-amber-50 hover:bg-[#E4E4E4]">
              {loading ? <Spinner/> : "Save"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
          </DialogFooter>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
