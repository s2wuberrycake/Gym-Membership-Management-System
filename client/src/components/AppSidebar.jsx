import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
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
  SidebarSeparator
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
  DatabaseBackup,
  Home,
  User2,
  UserLock
} from "lucide-react"

// Sidebar menu structure
const menuSections = [
  {
    label: "Dashboard",
    items: [{ title: "Home", url: "/", icon: Home }]
  },
  {
    label: "Members",
    items: [
      { title: "Memberships", url: "/members", icon: BookUser },
      { title: "Cancelled Memberships", url: "/archive", icon: BookX },
      { title: "Visit Log", url: "/visits", icon: CalendarClock }
    ]
  },
  {
    label: "Settings",
    items: [
      { title: "Accounts Manager", url: "/accounts", icon: UserLock, adminOnly: true },
      { title: "Backups and Restore", url: "/backup", icon: DatabaseBackup }
    ]
  }
]

const RenderMenuGroup = ({ label, items }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)

const AppSidebar = () => {
  const [username, setUsername] = useState("username")
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("token")
    try {
      if (token) {
        await axios.post(
          "http://localhost:3000/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }
    } catch {
      console.log("Server logout skipped or failed.")
    }

    localStorage.removeItem("token")
    navigate("/login")
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUsername(decoded.username || decoded.name || "user")
        setRole(decoded.role || null)
      } catch (err) {
        console.error("Invalid token:", err)
      }
    }
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent active:bg-transparent focus:outline-none">
              <Link to="/">
                <img src="./src/assets/logo.png" alt="logo" width={20} height={20} />
                <span>会員管理システム</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="w-full mx-auto" />

      <SidebarContent>
        {menuSections.map(section => (
          <RenderMenuGroup key={section.label} label={section.label} items={section.items} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10}>
                <DropdownMenuItem>Account</DropdownMenuItem>
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
