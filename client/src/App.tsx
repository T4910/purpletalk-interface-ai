import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { AuthContextProvider } from "./components/AuthContext";
import { useAuthContext } from "./hooks/use-auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthRouterProvider />
      </TooltipProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);

const AuthRouterProvider = () => {
  const authContext = useAuthContext();

  return (
    <RouterProvider router={router} context={{ queryClient, authContext }} />
  )
} 

export default App;
