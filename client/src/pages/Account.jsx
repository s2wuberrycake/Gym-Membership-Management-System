import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAccountById } from "@/lib/api/settings"
import { CornerDownLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent,
} from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
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

export default function Account() {
  const navigate = useNavigate()
  const { id } = useParams()

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

  if (loading) {
    return <div className="p-6">Loading account…</div>
  }
  if (!account) {
    return <div className="p-6 text-red-500">Account not found.</div>
  }

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-2"
      >
        <CornerDownLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="grid grid-cols-20 gap-4 mb-4 h-full">
        <div className="col-span-6 flex flex-col">
          <Container>
            <ContainerHeader>
              <ContainerTitle className="font-bold">Account Info</ContainerTitle>
              <p className="text-sm text-muted-foreground"><br/></p>
            </ContainerHeader>
            <Separator />

            <ContainerContent className="grid grid-cols-20 gap-4">
              <div className="col-span-20 flex flex-col p-2">
                <div className="flex justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-5xl font-bold break-words">{account.username}</span>
                  </div>
                </div>

                <div className="w-full flex justify-between mb-1">
                    <span className="text-lg font-medium">Role:</span>
                    <span className="text-lg font-medium">{account.role}</span> 
                </div>
              </div>
            </ContainerContent>
          </Container>
        </div>

        <div className="col-span-14 flex flex-col gap-4">
          <Container className="flex-1 flex flex-col">
            <ContainerHeader>
              <ContainerTitle className="font-bold">Manage Account</ContainerTitle>
              <p className="text-sm text-muted-foreground">
                Edit or delete this account.
              </p>
            </ContainerHeader>
            <Separator />

            <ContainerContent className="flex flex-col items-start gap-4">
              <div className="flex flex-wrap gap-2">
                <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <SheetTrigger asChild>
                    <Button size="sm">Edit Account</Button>
                  </SheetTrigger>
                  <EditAccount
                    account={account}
                    isSheetOpen={isEditOpen}
                    onClose={() => { setIsEditOpen(false); loadAccount() }}
                    refreshAccount={loadAccount}
                  />
                </Sheet>

                <Sheet open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                  <SheetTrigger asChild>
                    <Button size="sm" variant="destructive">
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
            </ContainerContent>
          </Container>
        </div>
      </div>
    </div>
  )
}
