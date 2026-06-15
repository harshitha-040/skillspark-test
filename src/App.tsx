import { useState, useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import DashboardPage from "./pages/DashboardPage";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import { cn } from "@/lib/utils";

import Index from "./pages/Index";
import SelectTechnology from "./pages/SelectTechnology";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import UserResultsPage from "./pages/UserResultsPage";
import AdminPage from "./pages/AdminPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

import PasswordProtect from "./components/PasswordProtect";

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const AppContent = ({ user, setUser, handleLogout, showLogin, setShowLogin, showSignup, setShowSignup }: any) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <SidebarProvider>
      {!isHomePage && <AppSidebar user={user} handleLogout={handleLogout} />}
      
      <SidebarInset className={cn(
        "bg-background min-h-screen text-foreground transition-colors duration-300",
        isHomePage ? "w-full" : ""
      )}>
        {/* NAVBAR */}
        <Navbar
          user={user}
          setUser={setUser}
        />

        {/* ROUTES */}
        <main className={cn(isHomePage ? "" : "px-6 md:px-12 lg:px-16 py-8 md:py-12")}>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Index />} />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={user ? <DashboardPage /> : <Navigate to="/" />}
            />

            {/* PRICING */}
            <Route path="/pricing" element={<PricingPage />} />

            {/* SELECT TECHNOLOGY */}
            <Route
              path="/select"
              element={user ? <SelectTechnology /> : <Navigate to="/" />}
            />

            {/* TEST PAGE */}
            <Route
              path="/test"
              element={user ? <TestPage /> : <Navigate to="/" />}
            />

            {/* RESULTS */}
            <Route path="/results" element={<ResultsPage />} />

            {/* HISTORY */}
            <Route
              path="/history"
              element={user ? <UserResultsPage /> : <Navigate to="/" />}
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <PasswordProtect>
                  <AdminPage />
                </PasswordProtect>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </SidebarInset>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          setUser={setUser}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <SignupModal
          setUser={setUser}
          onClose={() => setShowSignup(false)}
        />
      )}
    </SidebarProvider>
  );
};

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTechnology");
    localStorage.removeItem("selectedDifficulty");
    setUser(null);
    window.location.href = "#/";
  };

  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    window.addEventListener("open-login", openLogin);
    return () => window.removeEventListener("open-login", openLogin);
  }, []);

  useEffect(() => {
    const openSignup = () => setShowSignup(true);
    window.addEventListener("open-signup", openSignup);
    return () => window.removeEventListener("open-signup", openSignup);
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setLoadingUser(false);
    }
  }, []);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse text-xl font-bold uppercase tracking-widest">
          Loading MX Talent-Test...
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="skillspark-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <AppContent 
              user={user} 
              setUser={setUser} 
              handleLogout={handleLogout}
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              showSignup={showSignup}
              setShowSignup={setShowSignup}
            />
          </HashRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
