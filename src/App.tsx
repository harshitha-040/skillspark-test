import { useState, useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Index from "./pages/Index";
import SelectTechnology from "./pages/SelectTechnology";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

import PasswordProtect from "./components/PasswordProtect";

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

const queryClient = new QueryClient();

const App = () => {

  const [user, setUser] =
    useState<any>(null);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [showLogin, setShowLogin] =
    useState(false);

  const [showSignup, setShowSignup] =
    useState(false);

  /* =========================
     OPEN LOGIN MODAL
  ========================= */

  useEffect(() => {

    const openLogin = () => {

      setShowLogin(true);

    };

    window.addEventListener(
      "open-login",
      openLogin
    );

    return () => {

      window.removeEventListener(
        "open-login",
        openLogin
      );

    };

  }, []);

  /* =========================
     OPEN SIGNUP MODAL
  ========================= */

  useEffect(() => {

    const openSignup = () => {

      setShowSignup(true);

    };

    window.addEventListener(
      "open-signup",
      openSignup
    );

    return () => {

      window.removeEventListener(
        "open-signup",
        openSignup
      );

    };

  }, []);

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

    setLoadingUser(false);

  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loadingUser) {

    return null;

  }

  return (

    <QueryClientProvider client={queryClient}>

      <TooltipProvider>

        <Toaster />

        <Sonner />

        <HashRouter>

          {/* NAVBAR */}

          <Navbar
            user={user}
            setUser={setUser}
          />

          {/* ROUTES */}

          <Routes>

            {/* HOME */}

            <Route
              path="/"
              element={<Index />}
            />

            {/* DASHBOARD */}

            <Route
              path="/dashboard"
              element={
                user ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* PRICING */}

            <Route
              path="/pricing"
              element={<PricingPage />}
            />

            {/* SELECT TECHNOLOGY */}

            <Route
              path="/select"
              element={
                user ? (
                  <SelectTechnology />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* TEST PAGE */}

            <Route
              path="/test"
              element={
                user ? (
                  <TestPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* RESULTS */}

            <Route
              path="/results"
              element={<ResultsPage />}
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

            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>

          {/* LOGIN MODAL */}

          {showLogin && (

            <LoginModal
              setUser={setUser}
              onClose={() =>
                setShowLogin(false)
              }
            />

          )}

          {/* SIGNUP MODAL */}

          {showSignup && (

            <SignupModal
              setUser={setUser}
              onClose={() =>
                setShowSignup(false)
              }
            />

          )}

        </HashRouter>

      </TooltipProvider>

    </QueryClientProvider>

  );

};

export default App;