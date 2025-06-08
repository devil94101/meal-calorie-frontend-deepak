"use client"

import type * as React from "react"
import { Calendar, Home, LogOut, Moon, Sun } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Meal History",
      url: "/meals-logs",
      icon: Calendar,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { signOut } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/signin")
  }

  return (
    <Sidebar {...props} className="w-64 border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-semibold">CalorieTracker</span>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <div className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {data.navMain.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.url}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push(item.url)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="group-[[data-collapsed=true]]:hidden">
                    {item.title}
                  </span>
                </Button>
              )
            })}
          </div>
        </div>
        <div className="mt-auto">
          <Separator className="my-2" />
          <div className="grid gap-1 px-2 py-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span className="group-[[data-collapsed=true]]:hidden">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="group-[[data-collapsed=true]]:hidden">
                Sign Out
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
