import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import logo from "@/assets/mx-logo.jpg";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";

const Navbar = ({ user, setUser }: any) => {

  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const isHomePage = location.pathname === "/";

  const [showDropdown, setShowDropdown] =
    useState(false);

  /* =========================
     CLOSE DROPDOWN
  ========================= */

  useEffect(() => {

    const closeDropdown = () => {
      setShowDropdown(false);
    };

    window.addEventListener(
      "click",
      closeDropdown
    );

    return () => {
      window.removeEventListener(
        "click",
        closeDropdown
      );
    };

  }, []);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem(
      "selectedTechnology"
    );

    localStorage.removeItem(
      "selectedDifficulty"
    );

    setUser(null);

    navigate("/");

  };

  /* =========================
     START TEST
  ========================= */

  const handleTakeTest = () => {

    if (!user) {

      window.dispatchEvent(
        new Event("open-login")
      );

      return;

    }

    /* CLEAR OLD TEST FLOW */

    localStorage.removeItem(
      "selectedTechnology"
    );

    localStorage.removeItem(
      "selectedDifficulty"
    );

    navigate("/select");

  };

  return (

    <motion.nav
      initial={{
        y: -20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl text-foreground border-b border-border transition-all duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* =========================
              LOGO
          ========================= */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-4 text-foreground group"
          >
            <div className="w-12 h-12 bg-white p-1 rounded-2xl flex items-center justify-center shadow-md border border-border group-hover:scale-105 transition-transform duration-300">
              <img
                src={logo}
                alt="MX Talent-Test Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <span className="font-display font-bold text-2xl tracking-tight text-foreground hidden sm:block">
              MX Talent-Test
            </span>
          </Link>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-2xl bg-secondary/50 text-foreground hover:bg-muted transition-all duration-300 border border-border/50"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </button>

          {/* NAVIGATION LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={handleTakeTest}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              Take Test
            </button>

            {(!user || user.role === "admin") && (
              <Link
                to="/admin"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
              >
                Admin
              </Link>
            )}
          </div>

          {/* =========================
              LOGIN / PROFILE
          ========================= */}
          {!user ? (
            <button
              onClick={() =>
                window.dispatchEvent(
                  new Event("open-login")
                )
              }
              className="bg-primary hover:opacity-90 transition-all px-8 py-3 rounded-2xl text-white font-bold shadow-xl shadow-primary/20 text-sm uppercase tracking-widest"
            >
              Login
            </button>
          ) : (

            <div className="relative">

              {/* PROFILE BUTTON */}

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  setShowDropdown(
                    !showDropdown
                  );

                }}
                className="flex items-center gap-3"
              >

                {/* AVATAR */}

                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">

                  {user.username
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                {/* USER INFO */}

                <div className="hidden md:flex flex-col items-start">

                  <span className="text-sm font-semibold text-foreground">
                    {user.username}
                  </span>

                  <div className="flex items-center gap-2">

                    {/* ROLE */}

                    <p className="text-sm text-muted-foreground">

                      {user.role === "admin"
                        ? "Administrator"
                        : "Learner"}

                    </p>

                    {/* PLAN BADGE */}

                    {user.plan && (

                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide

                        ${

                          user.plan === "Pro"

                            ? "bg-purple-500/20 text-purple-400"

                            : user.plan === "Standard"

                            ? "bg-primary/20 text-primary"

                            : "bg-muted text-muted-foreground"

                        }`}
                      >

                        {user.plan}

                      </span>

                    )}

                  </div>

                </div>

              </button>

              {/* =========================
                  DROPDOWN
              ========================= */}

              <AnimatePresence>

                {showDropdown && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="absolute right-0 mt-4 w-72 bg-card border border-border rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-2xl overflow-hidden"
                  >

                    {/* USER INFO */}

                    <div className="p-4 mb-1 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/10">

                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                        Welcome back 👋
                      </p>

                      <p className="text-foreground font-bold text-xl tracking-tight">
                        {user.username}
                      </p>

                      <p className="text-muted-foreground text-xs mt-1 truncate">
                        {user.email}
                      </p>

                    </div>

                    {/* MENU */}

                    <div className="flex flex-col gap-1">

                      {/* HOME */}
                      
                      <button
                        onClick={() => {
                          navigate("/");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-secondary text-muted-foreground hover:text-foreground text-sm font-medium"
                      >
                        Home
                      </button>

                      {/* DASHBOARD */}

                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-secondary text-muted-foreground hover:text-foreground text-sm font-medium"
                      >
                        Dashboard
                      </button>

                      {/* RESULTS */}

                      <button
                        onClick={() => {
                          navigate("/history");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-secondary text-muted-foreground hover:text-foreground text-sm font-medium"
                      >
                        My Results
                      </button>

                      {/* ADMIN */}

                      {user.role === "admin" && (

                        <button
                          onClick={() => {
                            navigate("/admin");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          Admin Panel
                        </button>

                      )}

                      {/* SEPARATOR */}
                      <div className="h-px bg-border my-2" />

                      {/* LOGOUT */}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-destructive/10 text-destructive hover:text-destructive text-sm font-medium"
                      >
                        Logout
                      </button>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          )}

        </div>

      </div>

    </motion.nav>

  );

};

export default Navbar;
