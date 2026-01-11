"use client"
import { Workflow, Key, History, LogOut, CreditCard, Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { redirect, usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"


const items = [
  {
    title: "Workflows",
    url: "/workflow",
    icon: Workflow,
  },
  {
    title: "Executions",
    url: "/execution",
    icon: History,
  },
  {
    title: "Credentials",
    url: "/credential",
    icon: Key,
  },
]



export function AppSidebar() {

  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-background">
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 flex items-center justify-center">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Node<span className="text-primary">flow</span>
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="
                      flex items-center gap-3 rounded-md px-4 py-5
                      text-muted-foreground
                      transition-all
                      hover:bg-muted hover:text-foreground
                      data-[active=true]:bg-primary/10
                      data-[active=true]:text-primary
                    "
                  >
                    <a
                      href={item.url}
                      className={`
    group flex items-center gap-3 rounded-md px-4 py-2.5
    transition-colors duration-200 
    ${pathname === item.url
                          ? "bg-primary/20"
                          : "hover:bg-muted"
                        }
  `}
                    >
                      <item.icon className="h-5 w-5" />
                      <span
                        className={`
      text-sm
      ${pathname === item.url ? "font-semibold" : "font-medium"}
    `}
                      >
                        {item.title}
                      </span>
                    </a>


                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-3 py-4">
        <SidebarMenu className="space-y-1">
          {/* Upgrade to Pro */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="
          flex items-center gap-3 rounded-md px-4 py-2.5
          transition-colors duration-200
          hover:bg-primary/15
        "
            >
              <a href="/upgrade" className="flex items-center gap-3 w-full">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Upgrade to Pro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Billing Portal */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="
          flex items-center gap-3 rounded-md px-4 py-2.5
          transition-colors duration-200
          hover:bg-muted
        "
            >
              <a href="/billing" className="flex items-center gap-3 w-full">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium">Billing Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Sign out */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="
          flex items-center gap-3 rounded-md px-4 py-2.5
          transition-colors duration-200
          hover:bg-destructive/10
        "
            >
              <button
                type="button"
                className="flex items-center cursor-pointer gap-3 w-full text-left"
                onClick={() => {
                  authClient.signOut()
                  redirect('/login')
                }}
              >
                <LogOut className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  Sign out
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}
