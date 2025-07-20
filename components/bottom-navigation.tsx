"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Bot, Utensils, User, FileText } from "lucide-react"

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Log Food", href: "/food-logging", icon: Utensils },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Coach", href: "/ai-assistant", icon: Bot },
  { name: "Profile", href: "/profile", icon: User },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 px-2 py-2 z-50 shadow-2xl">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-emerald-600 bg-emerald-50 shadow-lg transform scale-110 border-2 border-emerald-200"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-gray-600"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-emerald-600" : "text-gray-600"}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
