import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Toaster, toast } from "sonner"

import bgImage from "../assets/bgtest.jpg"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

const Login = () => {
  const [values, setValues] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await axios.get("http://localhost:3000/auth/home", {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.status === 200) {
              localStorage.setItem("login", Date.now())  // <--- add this line
            navigate("/")
          }
        } catch (err) {
          console.log("Token check failed:", err)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [navigate])

  if (loading) return null

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:3000/auth/login", values)
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token)
        navigate("/")
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          toast.error("User does not exist")
        } else if (err.response.status === 401) {
          toast.error("Password is incorrect")
        }
      } else {
        console.error("Error:", err)
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className=""></div>
      <Toaster />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input
                  type="text"
                  name="username"
                  placeholder="admin"
                  value={values.username}
                  onChange={handleChanges}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="*****"
                  value={values.password}
                  onChange={handleChanges}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
            <p className="pt-5 text-center text-xs text-muted-foreground">
              会員管理システム
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login