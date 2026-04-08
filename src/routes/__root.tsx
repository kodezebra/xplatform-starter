import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/lib/context/AppContext";
import Dashboard from "./dashboard";
import Users from "./users";
import UserDetail from "./users.$userId";
import Settings from "./settings";

function useDocumentTitle() {
  const { appName } = useApp();
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Dashboard",
      "/users": "Users",
      "/settings": "Settings",
    };

    let title = appName;

    if (location.pathname === "/") {
      title = `${appName} - ${titles["/"]}`;
    } else if (location.pathname.startsWith("/users/")) {
      title = `${appName} - User Details`;
    } else if (location.pathname === "/users") {
      title = `${appName} - ${titles["/users"]}`;
    } else if (location.pathname === "/settings") {
      title = `${appName} - ${titles["/settings"]}`;
    }

    document.title = title;
  }, [location.pathname, appName]);
}

function Router() {
  useDocumentTitle();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<UserDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
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
