import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Trash } from "lucide-react"
import { Spinner } from "../ui/spinner"

interface DeleteGameDialogProps {
  _id?: string;
  id: number;
  onDelete: () => void;
}

export function DeleteGameDialog({ _id, id, onDelete }: DeleteGameDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/delete-game", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_id ? { _id } : { id }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete game")
      }
      onDelete()
      setOpen(false)
    } catch {
      setError("Failed to delete game. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" aria-label="Delete game">
          <Trash className="w-4 h-4 cursor-pointer hover:text-red-400 transition" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Game</DialogTitle>
        </DialogHeader>
        <div className="mb-4">Are you sure you want to delete this game? This action cannot be undone.</div>
        <DialogFooter>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" disabled={loading}>
            {loading ? <Spinner /> : "Delete"}
          </button>
          <DialogClose asChild>
            <button type="button" className="px-4 py-2 rounded border">Cancel</button>
          </DialogClose>
        </DialogFooter>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </DialogContent>
    </Dialog>
  )
}