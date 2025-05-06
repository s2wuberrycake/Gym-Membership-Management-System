import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  SidebarSeparator
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

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
      { title: "Accounts Manager", url: "/accounts", icon: UserLock, roles: ["admin"] },
      { title: "Backups and Restore", url: "/backup", icon: DatabaseBackup, roles: ["admin"] }
    ]
  }
]

const RenderMenuGroup = ({ label, items, role }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map(item => {
          const isRestricted = item.roles && !item.roles.includes(role)

          const menuButton = (
            <SidebarMenuButton
              asChild
              className={isRestricted ? "pointer-events-none opacity-50" : ""}
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )

          return (
            <SidebarMenuItem key={item.title}>
              {isRestricted ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>{menuButton}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="h-9 flex items-center text-sm">
                      Admin only
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                menuButton
              )}
            </SidebarMenuItem>
          )
        })}
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
        await axios.post(LOGOUT_API, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
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
                <p className="pl-2">Membership Management System</p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="w-full mx-auto" />

      <SidebarContent>
        {menuSections.map(section => (
          <RenderMenuGroup key={section.label} label={section.label} items={section.items} role={role} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <div className="px-2">
                    {username}
                  </div>
                  <ChevronUp className="ml-auto" />
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
