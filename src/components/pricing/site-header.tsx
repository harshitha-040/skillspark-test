import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="p-4 flex justify-between items-center bg-black text-white">
      <Link to="/" className="flex items-center gap-2">
        <GraduationCap />
        <span>MX Talent</span>
      </Link>

      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/pricing">Pricing</Link>
      </div>

      <button
        onClick={() => {
          window.dispatchEvent(new Event("open-login"));
        }}
      >
        Login
      </button>
    </header>
  );
}