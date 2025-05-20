import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login, authHome } from "@/lib/api/authorize"
import { Toaster, toast } from "sonner"
import bgLogin from "../assets/bglogin.png"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {
  const [values, setValues] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          await authHome(token)
          navigate("/")
          return
        } catch {}
      }
      setLoading(false)
    }
    checkAuth()
  }, [navigate])

  if (loading) return null

  const handleChanges = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await login(values)
      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (err) {
      if (err.response?.status === 404) toast.error("User not found")
      else if (err.response?.status === 401) toast.error("Wrong password")
      else toast.error("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-100 bg-background dark:bg-foreground/95 dark:text-background backdrop-blur-md p-12 flex flex-col border-r border-muted-foreground/80">
        <Toaster />
        <div className="pt-40">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                name="username"
                value={values.username}
                onChange={handleChanges}
                required
                className="dark:bg-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChanges}
                required
                className="dark:bg-foreground"
              />
            </div>
            <Button size="sm" variant="default" type="submit" className="w-full dark:bg-background">
              <div className="dark:text-foreground">
                Login
              </div>
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            会員管理システム
          </p>
        </div>
      </div>

      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgLogin})` }}
      />
    </div>
  )
}
