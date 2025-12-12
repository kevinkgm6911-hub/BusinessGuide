// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLoginClick = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login error:", err);
      alert("Login isn’t fully configured yet.");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-gray-950/90 backdrop-blur-md border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">
        {/* Brand */}
        <Link
          to="/"
          className="flex-1 min-w-0 text-left text-base sm:text-lg md:text-xl font-bold text-white"
        >
          <span className="block truncate">Side Hustle Starter</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-6 text-gray-300 text-sm">
          <Link to="/" className="hover:text-orange-400 transition">
            Home
          </Link>
          <Link to="/resources" className="hover:text-orange-400 transition">
            Resources
          </Link>
          <Link to="/start" className="hover:text-orange-400 transition">
            Start
          </Link>
          <Link to="/community" className="hover:text-orange-400 transition">
            Community
          </Link>
          <Link to="/about" className="hover:text-orange-400 transition">
            About
          </Link>
          {user && (
            <Link to="/profile" className="hover:text-orange-400 transition">
              Profile
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          {user ? (
            <>
              <span className="max-w-[160px] truncate text-gray-400">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-full border border-gray-700 px-3 py-1 text-gray-200 hover:border-orange-500 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="rounded-full bg-orange-600 px-3 py-1 text-white hover:bg-orange-700"
            >
              Log in
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-700/60 bg-gray-900/70 text-white hover:border-orange-500"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className="text-lg leading-none">
            {menuOpen ? "✖" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-md border-t border-gray-800 px-4 sm:px-6 py-4 space-y-4 text-gray-300 text-sm">
          <Link to="/" className="block hover:text-orange-400 transition">
            Home
          </Link>
          <Link to="/resources" className="block hover:text-orange-400 transition">
            Resources
          </Link>
          <Link to="/start" className="block hover:text-orange-400 transition">
            Start
          </Link>
          <Link to="/community" className="block hover:text-orange-400 transition">
            Community
          </Link>
          <Link to="/about" className="block hover:text-orange-400 transition">
            About
          </Link>

          {user && (
            <Link to="/profile" className="block hover:text-orange-400 transition">
              Profile
            </Link>
          )}

          <div className="pt-3 border-t border-gray-800">
            {user ? (
              <>
                <p className="text-xs text-gray-400 mb-2 truncate">
                  {user.email}
                </p>
                <button
                  onClick={signOut}
                  className="w-full rounded-full border border-gray-700 px-3 py-2 text-gray-200 hover:border-orange-500 hover:text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="w-full rounded-full bg-orange-600 px-3 py-2 text-white hover:bg-orange-700"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
