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
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Member from "./pages/Member"
import Account from "./pages/Account"

import RequireAuth from "./auth/RequireAuth"

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
    const handleStorage = (event) => {
      if (event.key === "token") {
        window.location.reload()
      }
      if (event.key === "logout") {
        navigate("/login", { replace: true })
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [navigate])

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* All other routes require a valid token */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Home />} />

        <Route path="members">
          <Route index element={<Members />} />
          <Route path=":id" element={<Member />} />
        </Route>

        <Route path="accounts/:id" element={<Account />} />
        <Route path="archive"         element={<Archive />} />
        <Route path="visits"          element={<Visits />} />
        <Route path="settings"        element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
