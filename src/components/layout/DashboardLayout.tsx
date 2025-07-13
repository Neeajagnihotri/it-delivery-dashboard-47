
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/ui/footer";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { GlobalDateFilterProvider } from "@/contexts/GlobalDateFilterContext";

const DashboardLayoutContent = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex w-full min-h-screen flex-col">
      {/* Fixed Static Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader />
      </div>
      
      {/* Content area with sidebar - add top padding for fixed header */}
      <div className="flex flex-1 pt-16">
        <AppSidebar />
        
        <main className={`flex-1 p-6 bg-muted/20 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
          <Outlet />
        </main>
      </div>
      
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <Footer />
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <GlobalDateFilterProvider>
      <SidebarProvider>
        <DashboardLayoutContent />
      </SidebarProvider>
    </GlobalDateFilterProvider>
  );
};

export default DashboardLayout;
