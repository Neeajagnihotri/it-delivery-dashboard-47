
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  Settings as SettingsIcon,
  PanelLeft
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Resource Management", url: "/resource-management", icon: Users },
  { title: "Financial Department", url: "/financial-department", icon: Database },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const navButton = (
      <SidebarMenuButton asChild className="h-12 rounded-lg transition-all duration-200">
        <NavLink 
          to={item.url} 
          end 
          className={({ isActive }) =>
            `w-full transition-all duration-200 ease-in-out flex items-center rounded-lg px-3 py-3 ${
              isActive 
                ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-500" 
                : "text-gray-700 font-medium hover:bg-blue-25 hover:text-blue-600 hover:shadow-sm"
            } ${collapsed ? "justify-center" : "justify-start"}`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-blue-700" : "text-gray-600 group-hover:text-blue-600"} ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && (
                <span className={`text-sm font-medium transition-colors ${isActive ? "text-blue-700" : "text-gray-700 group-hover:text-blue-600"}`}>
                  {item.title}
                </span>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {navButton}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="ml-2">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return navButton;
  };

  return (
    <TooltipProvider>
      <div
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-full w-full flex-col">
          {/* Sidebar Header with Toggle */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            {!collapsed && (
              <h2 className="text-sm font-semibold text-gray-700">Navigation</h2>
            )}
            <SidebarTrigger className="h-8 w-8 text-gray-600 hover:text-gray-900" />
          </div>
          
          <div className="flex-1 overflow-auto bg-slate-50 pt-4">
            <div className={`space-y-2 ${collapsed ? "px-2" : "px-3"}`}>
              <SidebarMenu className="space-y-1">
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="group">
                    {renderNavItem(item)}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
