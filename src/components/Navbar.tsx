import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import logo from "@/assets/mx-logo.jpg";

const Navbar = ({ user, setUser }: any) => {

  const location = useLocation();

  const navigate = useNavigate();

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
      className="fixed top-0 left-0 right-0 z-50 bg-[rgba(11,19,43,0.85)] backdrop-blur-md text-white shadow-md border-b border-cyan-500/10"
    >

      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 text-white"
        >

          <div className="w-11 h-11 bg-white p-1 rounded-full flex items-center justify-center shadow-sm">

            <img
              src={logo}
              alt="MX Talent-Test Logo"
              className="w-full h-full object-contain rounded-full"
            />

          </div>

          <span className="font-display font-semibold text-xl tracking-tight text-white">
            MX Talent-Test
          </span>

        </Link>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="flex items-center gap-6">

          {/* TAKE TEST */}

          <button
            onClick={handleTakeTest}
            className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
          >
            Take Test
          </button>

          {/* ADMIN */}

          {(!user ||
            user.role === "admin") && (

            <Link
              to="/admin"
              className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
            >
              Admin
            </Link>

          )}

          {/* =========================
              LOGIN
          ========================= */}

          {!user ? (

            <button
              onClick={() =>
                window.dispatchEvent(
                  new Event("open-login")
                )
              }
              className="bg-cyan-500 hover:bg-cyan-400 transition-all px-5 py-2 rounded-xl text-white font-semibold shadow-[0_0_15px_rgba(34,211,238,0.3)]"
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

                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">

                  {user.username
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                {/* USER INFO */}

                <div className="hidden md:flex flex-col items-start">

                  <span className="text-sm font-semibold text-white">
                    {user.username}
                  </span>

                  <div className="flex items-center gap-2">

                    {/* ROLE */}

                    <p className="text-sm text-gray-400">

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

                            ? "bg-cyan-500/20 text-cyan-400"

                            : "bg-gray-500/20 text-gray-300"

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
                    className="absolute right-0 mt-4 w-64 bg-[#081028] border border-cyan-500/20 rounded-2xl p-5 shadow-2xl z-50 backdrop-blur-xl"
                  >

                    {/* USER INFO */}

                    <div className="border-b border-white/10 pb-4 mb-4">

                      <p className="text-white font-bold text-lg">
                        Welcome back 👋
                      </p>

                      <p className="text-gray-300 mt-1">
                        {user.username}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        {user.email}
                      </p>

                    </div>

                    {/* MENU */}

                    <div className="flex flex-col gap-4">

                      {/* DASHBOARD */}
                      
                      <div
  onClick={() => navigate("/")}
  className="cursor-pointer hover:text-cyan-400 transition-colors"
>
  Home
</div>

                      <button
                        onClick={() => {

                          navigate(
                            "/dashboard"
                          );

                          setShowDropdown(
                            false
                          );

                        }}
                        className="text-left text-white hover:text-cyan-400 transition"
                      >
                        Dashboard
                      </button>

                      {/* RESULTS */}

                      <button
                        onClick={() => {

                          navigate(
                            "/results"
                          );

                          setShowDropdown(
                            false
                          );

                        }}
                        className="text-left text-white hover:text-cyan-400 transition"
                      >
                        My Results
                      </button>

                      {/* ADMIN */}

                      {user.role === "admin" && (

                        <button
                          onClick={() => {

                            navigate(
                              "/admin"
                            );

                            setShowDropdown(
                              false
                            );

                          }}
                          className="text-left text-white hover:text-cyan-400 transition"
                        >
                          Admin Panel
                        </button>

                      )}

                      {/* CERTIFICATES */}

                      <button
                        className="text-left text-gray-500 cursor-not-allowed"
                      >
                        Certificates
                        (Coming Soon)
                      </button>

                      {/* LOGOUT */}

                      <button
                        onClick={
                          handleLogout
                        }
                        className="text-left text-red-400 hover:text-red-300 transition"
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