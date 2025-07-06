import { Providers } from "@/components/common/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/Dashboard/app-sidebar";
import { DashboardHeader } from "@/layouts/Dashboard/dashboard-header";
import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col w-0">
            <DashboardHeader />
            <main className="flex-1 p-6 bg-[#f9f9f9]">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
