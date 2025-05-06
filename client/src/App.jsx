import { Routes, Route, Outlet, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import AppSidebar from "./components/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"
import { Toaster } from "sonner"

import Home from "./pages/Home"
import Members from "./pages/Members"
import Archive from "./pages/Archive"
import Visits from "./pages/Visits"
import Accounts from "./pages/Accounts"
import Backup from "./pages/Backup"
import Login from "./pages/Login"
import Member from "./pages/Member"
import RequireRole from "./auth/RequireRole"

function Layout() {
  const defaultOpen = Cookies.get("sidebar_state") === "true"

  return (
    <div className="flex">
      <Toaster position="bottom-right" />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full">
          <Navbar />
          <div className="px-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        // Optionally trigger a reload or redirect
        window.location.reload()
      }
    }

    const handleStorage = (e) => {
      if (e.key === "logout") {
        navigate("/login")
      }
    }
    
    window.addEventListener("storage", handleStorage)
    window.addEventListener("storage", handleStorageChange)
  
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [navigate])
  

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="members">
          <Route index element={<Members />} />
          <Route path=":id" element={<Member />} />
        </Route>
        <Route path="archive" element={<Archive />} />
        <Route path="visits" element={<Visits />} />
        <Route
          path="accounts"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <Accounts />
            </RequireRole>
          }
        />
        <Route
          path="backup"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <Backup />
            </RequireRole>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
