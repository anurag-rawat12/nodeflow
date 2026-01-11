import { AppSidebar } from "@/components/ui/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { requireAuth } from "@/lib/auth-utils"
import Providers from "../provider"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <SidebarTrigger />

          <Providers>
            {children}
          </Providers>
        </main>
      </div>
    </SidebarProvider>
  )
}
