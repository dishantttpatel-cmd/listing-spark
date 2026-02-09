import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BrowseListings from "./pages/BrowseListings";
import ListingDetail from "./pages/ListingDetail";
import AddProduct from "./pages/AddProduct";
import MyListings from "./pages/MyListings";
import BuyCredits from "./pages/BuyCredits";
import AdminPanel from "./pages/admin/AdminPanel";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<BrowseListings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/buy-credits" element={<BuyCredits />} />
            </Route>
            <Route path="/admin" element={<AdminRoute><AppLayout /></AdminRoute>}>
              <Route index element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
