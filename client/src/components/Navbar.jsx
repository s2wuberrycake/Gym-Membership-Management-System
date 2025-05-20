import { SidebarTrigger } from "./ui/sidebar"

const Navbar = () => {

  return (
    <nav className="sticky top-0 z-50 bg-background p-4 flex items-center justify-between">
      <SidebarTrigger
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full
          text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
          [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-secondary hover:text-secondary-foreground py-2 group/toggle h-9 w-9 px-0"
      />
    </nav>
  )
}

export default Navbar
