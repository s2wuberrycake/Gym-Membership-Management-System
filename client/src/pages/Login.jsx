import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Toaster, toast } from "sonner"

import bgLogin from "../assets/bglogin.png"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Container,
  ContainerHeader,
  ContainerTitle,
  ContainerContent
} from "@/components/ui/container"

const Login = () => {
  const [values, setValues] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          await axios.get("http://localhost:3000/auth/home", {
            headers: { Authorization: `Bearer ${token}` },
          })
          localStorage.setItem("login", Date.now())
          navigate("/")
        } catch {
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
      const { data } = await axios.post("http://localhost:3000/auth/login", values)
      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          toast.error("User does not exist")
        } else if (err.response.status === 401) {
          toast.error("Password is incorrect")
        }
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <Toaster />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-6">
          <Container>
            <ContainerHeader>
              <ContainerTitle className="text-center text-2xl font-sans">
                Login
              </ContainerTitle>
            </ContainerHeader>
            <ContainerContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input
                    type="text"
                    name="username"
                    placeholder="superadmin"
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
                    placeholder="**********"
                    value={values.password}
                    onChange={handleChanges}
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="w-full">
                  Login
                </Button>
              </form>
              <p className="pt-5 text-center text-xs text-muted-foreground">
                会員管理システム
              </p>
            </ContainerContent>
          </Container>
        </div>
      </div>
    </div>
  )
}

export default Login
