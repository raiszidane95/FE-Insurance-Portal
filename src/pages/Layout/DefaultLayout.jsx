import { Link, Outlet } from "react-router-dom"
import { LogOut, Menu, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Layout() {
  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/pendaftaran", label: "Pendaftaran" },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50 shadow-sm bg-primaryBlue">
        <nav className="hidden w-full flex-col gap-5 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <ShieldCheck className="h-6 w-6" color="white" />
          <Link to="/" className="flex items-center text-white gap-2 text-lg font-semibold md:text-[18px] text-primary">
            <span>Portal Asuransi</span>
          </Link>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="text-white transition-colors p-1.5 hover:text-primary rounded-md hover:bg-white">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* show when screen on mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
              <Menu className="h-5 w-5" color="white" />
              <span className="sr-only">Buka menu navigasi</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
                <ShieldCheck className="h-6 w-6" />
                <span>Portal Asuransi</span>
              </Link>
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className="text-muted-foreground hover:text-primary">
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4" >
          <div className="" onClick={() => {
            window.location.href = "/login";
            localStorage.removeItem("token");
          }}>
            <LogOut color="white" className="md:hidden" />
            <Button variant="secondary" className="hidden md:block hover:bg-[#FF0B55] hover:text-white">Logout</Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-[#e3f2fd]">
        <Outlet />
      </main>
    </div>
  )
}
