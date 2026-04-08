import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/lib/context/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppRoutes } from "./routes/__root";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AppRoutes />
          <Toaster position="bottom-right" richColors closeButton />
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
