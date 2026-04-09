import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, MessageSquare, X, User, LogOut, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/users/Avatar";
import { useApp } from "@/lib/context/AppContext";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";
import { useVersion } from "@/lib/hooks/useVersion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/users", label: "Users", icon: Users, requiredRole: "admin" as const },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { appName } = useApp();
  const { user, logout } = useAuth();
  const location = useLocation();
  const { hasAccess: isAdmin } = useRoleGuard("admin");
  const version = useVersion();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-sidebar border-r flex flex-col z-50
        transition-transform duration-300 ease-in-out
        w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={handleNavClick}>
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <MessageSquare className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">
              {appName}
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-8"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
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
                  <Link
                    to={item.path}
                    onClick={handleNavClick}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }
                    `}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar
                  userId={user.id}
                  userName={user.name}
                  imagePath={user.image_path}
                  size="sm"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border bg-sidebar shadow-lg overflow-hidden">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to={`/users/${user.id}`}
                      onClick={() => { setUserMenuOpen(false); handleNavClick(); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-sidebar-accent/50"
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => { setUserMenuOpen(false); handleNavClick(); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-sidebar-accent/50"
                    >
                      <Settings2 className="size-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-sidebar-accent/50"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {version && (
            <p className="text-xs text-muted-foreground truncate text-center mt-2">
              v{version}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
