import { jwtDecode } from "jwt-decode"
import { Link, useNavigate } from "react-router-dom"
import { useCallback , useEffect , useState } from "react"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { BookUser, BookX, CalendarClock, ChevronUp, DatabaseBackup, Home, User2, UserLock } from "lucide-react"

// Sidebar menu items
const menuDashboard = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  }
]

const menuMembers = [
  {
    title: "Memberships",
    url: "/members",
    icon: BookUser,
  },
  {
    title: "Cancelled Memberships",
    url: "/archive",
    icon: BookX,
  },
  {
    title: "Visit Log",
    url: "/visits",
    icon: CalendarClock,
  }
]

const menuSettings = [
  {
    title: "Accounts Manager",
    url: "/accounts",
    icon: UserLock,
  },
  {
    title: "Backups and Restore",
    url: "/backup",
    icon: DatabaseBackup,
  }
]

const AppSidebar = () => {
  const [username, setUsername] = useState("username")

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
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }
    } catch (error) {
      console.log("Server logout skipped or failed.")
    }

    localStorage.removeItem("token")
    navigate("/login")
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(localStorage.getItem("token"))
        console.log("Decoded token:", decoded)
        setUsername(decoded.username || decoded.name || "user")
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
      <SidebarSeparator className="w-full mx-auto"/>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuDashboard.map(item => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Members</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuMembers.map(item => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuSettings.map(item => (
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
              <DropdownMenuContent align="end">
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
