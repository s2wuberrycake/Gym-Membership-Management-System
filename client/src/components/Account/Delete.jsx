import React, { useState } from "react"
import { deleteAccount } from "@/lib/api/accounts"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"

const DeleteAccount = ({ account, isSheetOpen, onClose, onDeleted }) => {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await deleteAccount(account.account_id)
      toast.success("Account deleted")
      onDeleted?.()
      onClose()
    } catch (err) {
      console.error("Delete error", err)
      toast.error("Failed to delete account")
    } finally {
      setSubmitting(false)
    }
  }

  const { username } = account || {}

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">
          Delete {username}
        </SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={handleSubmit}>
            <div className="p-6 pb-2 max-w-md">
              <h2 className="text-xl font-bold">
                Delete {username}?
              </h2>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this account? This action cannot be undone.
              </p>
            </div>

            <div className="p-6 pt-2 space-y-4 max-w-md">
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}

export default DeleteAccount
