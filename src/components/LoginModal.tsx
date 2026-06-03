import { useState } from "react";

type Props = {
  setUser: (user: any) => void;
  onClose: () => void;
};

function LoginModal({ setUser, onClose }: Props) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async () => {

    setError("");
    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),

        }
      );

      const data =
        await res.json();

      if (data.success) {

        localStorage.setItem(

          "user",

          JSON.stringify(
            data.user
          )

        );

        setUser(data.user);

        onClose();

        window.location.href =
          "#/dashboard";

      } else {

        setError(data.message);

      }

    } catch {

      setError("Server error");

    }

    setLoading(false);

  };

  return (

    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[360px] shadow-2xl text-white">

        {/* TITLE */}

        <h2 className="text-xl font-semibold mb-5 text-center">

          Login

        </h2>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {/* ERROR */}

        {error && (

          <p className="text-red-400 text-sm mb-3 text-center">

            {error}

          </p>

        )}

        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
          disabled={
            loading ||
            !email ||
            !password
          }
          className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white py-2.5 rounded-lg mb-2 disabled:opacity-50"
        >

          {loading
            ? "Please wait..."
            : "Login"}

        </button>

        {/* SIGNUP REDIRECT */}

        <p className="text-sm text-center mt-3 text-white/70">

          Don't have an account?{" "}

          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => {

              onClose();

              window.location.href =
                "#/pricing";

            }}
          >

            Sign up

          </span>

        </p>

        {/* CLOSE */}

        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-white/50 hover:text-white"
        >

          Close

        </button>

      </div>

    </div>

  );

}

export default LoginModal;