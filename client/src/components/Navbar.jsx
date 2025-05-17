import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeProvider"

import { SidebarTrigger } from "./ui/sidebar"
import { Switch } from "@/components/ui/switch"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-background p-4 flex items-center justify-between">
      <SidebarTrigger
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full
          text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
          [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-secondary hover:text-secondary-foreground py-2 group/toggle h-9 w-9 px-0"
      />

      <div className="flex items-center gap-4">
        {theme === "dark"
          ? <Sun className="w-5 h-5" />
          : <Moon className="w-5 h-5" />
        }
        <Switch
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
      </div>
    </nav>
  )
}

export default Navbar
