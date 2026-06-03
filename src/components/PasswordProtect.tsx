import {
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const ADMIN_PASSWORD = "root#123";

const SESSION_STORAGE_KEY =
  "admin_authenticated";

interface PasswordProtectProps {
  children: ReactNode;
}

const PasswordProtect = ({
  children,
}: PasswordProtectProps) => {

  const { toast } = useToast();

  const [password, setPassword] =
    useState("");

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      sessionStorage.getItem(
        SESSION_STORAGE_KEY
      ) === "true"
    );

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = () => {

    if (
      password.trim() ===
      ADMIN_PASSWORD
    ) {

      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        "true"
      );

      setIsAuthenticated(true);

      toast({
        title: "Success",
        description:
          "Admin access granted",
      });

    } else {

      toast({
        title: "Access Denied",
        description:
          "Incorrect admin password",
        variant: "destructive",
      });

    }

  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    sessionStorage.removeItem(
      SESSION_STORAGE_KEY
    );

    setIsAuthenticated(false);

    toast({
      title: "Logged Out",
      description:
        "Admin session ended",
    });

  };

  /* =========================
     AUTHORIZED
  ========================= */

  if (isAuthenticated) {

    return (

      <div className="relative">

        {/* LOGOUT BUTTON */}

        <div className="fixed top-6 right-6 z-50">

          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>

        </div>

        {children}

      </div>

    );

  }

  /* =========================
     LOGIN SCREEN
  ========================= */

  return (

    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1510519138101-570d1dca3d66?fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* CARD */}

      <div className="relative z-10 w-full max-w-md bg-[#071028]/90 border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.15)]">

        <h1 className="text-3xl font-bold text-white mb-3 text-center">

          Admin Access

        </h1>

        <p className="text-gray-300 text-center mb-8">

          Enter admin password to continue

        </p>

        <div className="space-y-5">

          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleLogin()
            }
            className="bg-white text-black h-12"
          />

          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl"
          >

            Enter Admin Panel

          </Button>

        </div>

      </div>

    </div>

  );

};

export default PasswordProtect;