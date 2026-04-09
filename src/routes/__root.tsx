import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/lib/context/AppContext";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";
import Dashboard from "./dashboard";
import Users from "./users";
import UserDetail from "./users.$userId";
import Settings from "./settings";
import Login from "./login";
import ChangePassword from "./change-password";

function useDocumentTitle() {
  const { appName } = useApp();
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Dashboard",
      "/users": "Users",
      "/settings": "Settings",
      "/login": "Login",
      "/change-password": "Change Password",
    };

    let title = appName;

    if (location.pathname === "/") {
      title = `${appName} - ${titles["/"]}`;
    } else if (location.pathname.startsWith("/users/")) {
      title = `${appName} - User Details`;
    } else if (titles[location.pathname]) {
      title = `${appName} - ${titles[location.pathname]}`;
    }

    document.title = title;
  }, [location.pathname, appName]);
}

function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

function RoleGuard({ role, children }: { role: "admin" | "editor" | "viewer"; children?: React.ReactNode }) {
  const { hasAccess } = useRoleGuard(role);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

function PasswordChangeGuard({ children }: { children?: React.ReactNode }) {
  const { requiresPasswordChange } = useAuth();

  if (requiresPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

function Router() {
  useDocumentTitle();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<PasswordChangeGuard />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="users"
              element={<RoleGuard role="admin"><Users /></RoleGuard>}
            />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function AppRoutes() {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  );
}
