import { useState, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { TooltipProvider } from "@/components/ui/tooltip";

interface SidebarContextType {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setCollapsed: () => {},
});

export function AppLayout() {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <SidebarContext.Provider value={{ isCollapsed, setCollapsed }}>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <div className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"} max-md:ml-0`}>
            <Header onMenuClick={() => setCollapsed(!isCollapsed)} />
            <main className="p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </TooltipProvider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
