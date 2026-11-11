import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Profile from "./Profile";

const Navbar = () => {
  const { isAuthenitcate } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex h-[12vh] min-h-[64px] w-full items-center justify-between border-b border-white/10 bg-[#0b1226]/80 px-6 backdrop-blur-md md:px-10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
          <Sparkles size={18} />
        </span>
        <span className="text-2xl font-bold text-white">
          Ai <span className="text-cyan-300">prep.</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isAuthenitcate ? (
          <Profile />
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-white/15 px-5 py-2 font-medium text-slate-200 transition hover:bg-white/10"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-105"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;