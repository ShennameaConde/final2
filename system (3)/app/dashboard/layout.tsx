import type { ReactNode } from "react"
import Link from "next/link"
import { BookOpen, BookCopy, BarChart, Settings, BookMarked, Clock } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "Books",
    href: "/dashboard/books",
    icon: <BookCopy className="h-4 w-4" />,
  },
  {
    title: "My Loans",
    href: "/dashboard/loans",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: <BookMarked className="h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Check for authentication cookie
  const token = cookies().get("XSRF-TOKEN")?.value

  // In development, we'll allow access without a token for easier testing
  const isDevelopment = process.env.NODE_ENV === "development"

  // If no token and not in development, redirect to login
  if (!token && !isDevelopment) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">Library Management System</span>
            <span className="font-bold md:hidden">LMS</span>
          </Link>
          <div className="hidden md:flex">
            <MainNav items={navItems} />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <nav className="grid items-start gap-2 py-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
