import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Trash } from "lucide-react"

interface DeleteGameDialogProps {
  onDelete: () => void
}

export function DeleteGameDialog({ onDelete }: DeleteGameDialogProps) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    onDelete()
    setOpen(false)
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
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
          <DialogClose asChild>
            <button type="button" className="px-4 py-2 rounded border">Cancel</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}