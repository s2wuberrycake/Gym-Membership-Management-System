import { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { LOGOUT_API } from "@/lib/api"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"

import {
  BookUser,
  BookX,
  CalendarClock,
  ChevronUp,
  Home,
  User2,
  UserLock
} from "lucide-react"

const menuSections = [
  {
    label: "Dashboard",
    items: [{ title: "Home", url: "/", icon: Home }]
  },
  {
    label: "Memberships",
    items: [
      { title: "Management", url: "/members", icon: BookUser },
      { title: "Cancelled", url: "/archive", icon: BookX },
      { title: "Visit Log", url: "/visits", icon: CalendarClock }
    ]
  },
  {
    label: "Config",
    items: [
      { title: "Settings", url: "/settings", icon: UserLock }
    ]
  }
]

const RenderMenuGroup = ({ label, items, currentPath }) => (
  <SidebarGroup>
    <SidebarGroupLabel className="font-bold">{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map(item => {
          const isActive = currentPath === item.url

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="transition-colors font-medium w-full"
              >
                <Link
                  to={item.url}
                  className="flex flex-wrap items-center justify-between gap-2 pl-6 pr-3 py-2 w-full rounded-xl hover:bg-accent transition-all"
                >
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="break-words text-left">{item.title}</span>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)

const AppSidebar = () => {
  const [username, setUsername] = useState("username")
  const [accountId, setAccountId] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("token")
    try {
      if (token) {
        await axios.post(LOGOUT_API, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    } catch {
      console.log("Server logout skipped or failed.")
    }

    localStorage.setItem("logout", Date.now())
    localStorage.removeItem("token")
    navigate("/login")
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUsername(decoded.username || decoded.name || "user")
        setAccountId(decoded.id || decoded.account_id || null)
      } catch (err) {
        console.error("Invalid token:", err)
      }
    }
  }, [])

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="py-4 border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent active:bg-transparent focus:outline-none">
              <Link to="/" className="flex items-center font-medium">
                <img src="./src/assets/logo.png" alt="logo" width={30} height={30} />
                <p className="pl-2">Membership Management System</p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menuSections.map(section => (
          <RenderMenuGroup
            key={section.label}
            label={section.label}
            items={section.items}
            currentPath={currentPath}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="rounded-full px-3 py-2 hover:bg-accent transition-colors flex items-center">
                  <User2 />
                  <div className="px-2 font-medium">{username}</div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10}>
                <DropdownMenuItem onSelect={() => navigate(`/accounts/${accountId}`)}>
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
