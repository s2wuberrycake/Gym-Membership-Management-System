import { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { LOGOUT_API } from "@/lib/api"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

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
    items: [{ title: "Settings", url: "/settings", icon: UserLock }]
  }
]

function RenderMenuGroup({ label, items, currentPath }) {
  const { open } = useSidebar()

  return (
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
                  className="transition-colors font-medium w-full rounded-md"
                >
                  <Link
                    to={item.url}
                    className="flex items-center justify-between gap-2
                               pl-6 pr-3 py-2 w-full
                               rounded-md
                               hover:bg-accent/10
                               transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words text-left">{item.title}</span>
                    </div>
                    {open && isActive && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const { open } = useSidebar()

  const [username, setUsername] = useState("username")
  const [accountId, setAccountId] = useState(null)
  const [userRole, setUserRole] = useState(null)

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        await axios.post(LOGOUT_API, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch {
        console.log("Logout failed, continuing.")
      }
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
        setUsername(decoded.username || decoded.name)
        setAccountId(decoded.id || decoded.account_id)
        setUserRole(decoded.role)
      } catch {
        console.error("Invalid JWT")
      }
    }
  }, [])

  const isAdmin = userRole === "admin"

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="py-4 border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent active:bg-transparent focus:outline-none"
            >
              <Link to="/" className="flex items-center font-medium">
                <img src="logo.png" alt="logo" width={30} height={30} />
                <p className="pl-2">Membership Management System</p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className={open ? "ml-4" : ""}>
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
              {!isAdmin ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          className={`flex items-center gap-2 px-3 py-2 rounded-md
                                      hover:bg-accent/10 transition-colors
                                      ${open ? "ml-4" : ""}`}
                        >
                          <User2 />
                          <span className="font-medium">{username}</span>
                          <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="rounded-lg p-4 shadow-lg w-60"
                    >
                      <p className="text-xs">
                        Logged in with a Staff account. Limited permission is granted.
                        Some features and options are disabled. Log in with an Admin
                        account to access them.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className={`flex items-center gap-2 px-3 py-2 rounded-md
                                hover:bg-accent/10 transition-colors
                                ${open ? "ml-4" : ""}`}
                  >
                    <User2 />
                    <span className="font-medium">{username}</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              )}
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
