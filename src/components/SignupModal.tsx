import { useState } from "react";

type Props = {
  setUser: (user: any) => void;
  onClose: () => void;
};

function SignupModal({
  setUser,
  onClose,
}: Props) {

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     SIGNUP
  ========================= */

  const handleSignup = async () => {

    setError("");

    try {

      setLoading(true);

      /* =========================
         GET SELECTED PLAN
      ========================= */

      const selectedPlan =
        JSON.parse(
          localStorage.getItem(
            "selectedPlan"
          ) || "null"
        );

      const plan =
        selectedPlan?.tier
          ?.toLowerCase()
        || "free";

      /* =========================
         CREATE ACCOUNT
      ========================= */

      const response =
        await fetch(
          "http://localhost:5000/signup",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              username,

              email,

              password,

              plan,

            }),

          }
        );

      const data =
        await response.json();

      if (!data.success) {

        setError(
          data.message ||
          "Signup failed"
        );

        setLoading(false);

        return;

      }

      /* =========================
         AUTO LOGIN
      ========================= */

      const loginResponse =
        await fetch(
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

      const loginData =
        await loginResponse.json();

      if (loginData.success) {

        localStorage.setItem(

          "user",

          JSON.stringify(
            loginData.user
          )

        );

        setUser(
          loginData.user
        );

      }

      /* =========================
         CLEANUP
      ========================= */

      localStorage.removeItem(
        "selectedPlan"
      );

      alert(
        `${plan.toUpperCase()} account created successfully`
      );

      onClose();

      window.location.href =
        "#/dashboard";

    } catch (err) {

      console.log(err);

      setError(
        "Server error"
      );

    }

    setLoading(false);

  };

  return (

    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[360px] shadow-2xl text-white">

        <h2 className="text-xl font-semibold mb-5 text-center">

          Create Account

        </h2>

        {/* USERNAME */}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

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

        {/* BUTTON */}

        <button
          onClick={handleSignup}
          disabled={
            loading ||
            !username ||
            !email ||
            !password
          }
          className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white py-2.5 rounded-lg mb-2 disabled:opacity-50"
        >

          {loading
            ? "Please wait..."
            : "Create Account"}

        </button>

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

export default SignupModal;