import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, MessageSquare, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./AppLayout";
import { useApp } from "@/lib/context/AppContext";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";
import { useVersion } from "@/lib/hooks/useVersion";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/users", label: "Users", icon: Users, requiredRole: "admin" as const },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { appName } = useApp();
  const location = useLocation();
  const { isCollapsed, setCollapsed } = useSidebar();
  const { hasAccess: isAdmin } = useRoleGuard("admin");
  const version = useVersion();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-sidebar border-r flex flex-col z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16 -translate-x-full md:translate-x-0" : "w-64"}
        max-md:w-64
      `}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <MessageSquare className="size-4 text-primary-foreground" />
            </div>
            <span className={`font-semibold text-lg transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"} hidden md:block`}>
              {appName}
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden size-8"
            onClick={() => setCollapsed(true)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 p-2 md:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems
              .filter((item) => {
                if (item.requiredRole === "admin" && !isAdmin) return false;
                return true;
              })
              .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        onClick={handleNavClick}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          }
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className={`transition-all duration-300 ${isCollapsed ? "hidden md:hidden" : ""}`}>
                          {item.label}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 md:p-4 border-t">
          <div className={`px-3 py-2 ${isCollapsed ? "text-center" : ""}`}>
            {version && (
              <p className="text-xs text-muted-foreground truncate">
                {isCollapsed ? `v${version}` : `Version ${version}`}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
