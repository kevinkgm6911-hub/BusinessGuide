import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();

  // ... existing header + nav

  return (
    <header /* ... */>
      {/* left side: logo */}
      {/* center: nav */}
      <nav className="hidden md:flex gap-6 text-gray-300 items-center">
        <Link to="/">Home</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/start">Start</Link>
        <Link to="/community">Community</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* right side: auth */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <span className="text-xs text-gray-400">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-200 hover:border-orange-500"
            >
              Log out
            </button>
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="rounded-full bg-orange-600 px-3 py-1 text-xs text-white hover:bg-orange-700"
          >
            Log in / Sign up
          </button>
        )}
      </div>

      {/* ...mobile menu can get a similar treatment */}
    </header>
  );
}
