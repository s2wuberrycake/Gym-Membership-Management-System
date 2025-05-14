import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAccountById } from "@/lib/api/accounts"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { CornerDownLeft } from "lucide-react"
import { toast } from "sonner"
import EditAccount from "@/components/Account/Edit"
import DeleteAccount from "@/components/Account/Delete"

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload))
  } catch {
    return {}
  }
}

const Account = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { role: userRole, id: userId } = decodeJwt(
    localStorage.getItem("token") || ""
  )

  const loadAccount = async () => {
    setLoading(true)
    try {
      const data = await getAccountById(id)
      setAccount(data)
    } catch (err) {
      toast.error(err.message || "Failed to load account")
      setAccount(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userRole !== "admin" && Number(id) !== userId) {
      navigate("/settings")
      return
    }
    loadAccount()
  }, [id, userRole, userId, navigate])

  if (loading) return <div className="p-4">Loading...</div>
  if (!account)
    return (
      <div className="p-4 text-red-500">
        Account not found or failed to load.
      </div>
    )

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2"
      >
        <CornerDownLeft className="w-4 h-4" />
        Return
      </Button>

      <h1 className="text-2xl font-bold mb-4">
        Viewing Account: {account.username}
      </h1>

      <div className="space-y-2">
        <p>
          <strong>Username:</strong> {account.username}
        </p>
        <p>
          <strong>Role:</strong> {account.role}
        </p>
      </div>

      <div className="flex gap-3">
        <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsEditOpen(true)}>
              Edit Account
            </Button>
          </SheetTrigger>
          <EditAccount
            account={account}
            isSheetOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            refreshAccount={loadAccount}
          />
        </Sheet>

        <Sheet open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <SheetTrigger asChild>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete Account
            </Button>
          </SheetTrigger>
          <DeleteAccount
            account={account}
            isSheetOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onDeleted={() => navigate("/settings")}
          />
        </Sheet>
      </div>
    </div>
  )
}

export default Account