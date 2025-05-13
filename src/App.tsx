
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ApiList from "./pages/ApiList";
import ApiLogs from "./pages/ApiLogs";
import ApiKeys from "./pages/ApiKeys";
import UsageStats from "./pages/UsageStats";
import Subscription from "./pages/Subscription";
import PlansManagement from "./pages/PlansManagement";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="apis" element={<ApiList />} />
              <Route path="logs" element={<ApiLogs />} />
              <Route path="keys" element={<ApiKeys />} />
              <Route path="stats" element={<UsageStats />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="plans" element={<PlansManagement />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Login />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
