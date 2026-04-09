import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/lib/context/AppContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppRoutes } from "./routes/__root";
import { useAdminSeed } from "@/lib/hooks/useAdminSeed";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminSeeder() {
  useAdminSeed();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthProvider>
            <AdminSeeder />
            <AppRoutes />
            <Toaster position="bottom-right" richColors closeButton />
          </AuthProvider>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
