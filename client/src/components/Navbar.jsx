import { SidebarTrigger } from "./ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme/ThemeProvider"

const Navbar = () => {
    const { theme, toggleTheme } = useTheme()

  return (
    <nav className="p-4 flex items-center justify-between">
      <SidebarTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
          text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
          [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground py-2 group/toggle h-8 w-8 px-0"/>

      {/* TODO : functional search bar */}

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
          text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
          [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground py-2 group/toggle h-8 w-8 px-0"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  )
}
export default Navbar