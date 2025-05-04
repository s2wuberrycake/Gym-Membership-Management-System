import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Cookies from "js-cookie"

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

import RequireAuth from "./auth/RequireAuth"
import RoleProtectedRoute from "./auth/RoleProtectedRoute"

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
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Home />} />
          <Route path="members" element={<Members />} />
          <Route path="archive" element={<Archive />} />
          <Route path="visits" element={<Visits />} />

          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="accounts" element={<Accounts />} />
            <Route path="backup" element={<Backup />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
