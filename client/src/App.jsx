import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { SidebarProvider } from "./components/ui/sidebar"
import Navbar from "./components/Navbar"
import AppSidebar from "./components/AppSidebar"
import Cookies from "js-cookie"

import Home from "./pages/Home"
import Members from "./pages/Members"
import Archive from "./pages/Archive"
import Visits from "./pages/Visits"
import Accounts from "./pages/Accounts"
import Backup from "./pages/Backup"
import Login from "./pages/Login"
import RequireAuth from "./components/RequireAuth"

function Layout() {
  const defaultOpen = Cookies.get("sidebar_state") === "true"

  return (
    <div className="flex">
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
        {/* Protected Routes */}
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Home />} />
          <Route path="members" element={<Members />} />
          <Route path="archive" element={<Archive />} />
          <Route path="visits" element={<Visits />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="backup" element={<Backup />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
