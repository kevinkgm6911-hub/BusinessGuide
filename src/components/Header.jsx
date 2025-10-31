import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  STARTER_SLUGS,
  percentComplete,
  onProgress,
} from "../lib/progress";

const FLAG = "starterBarSeen:v1";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pct, setPct] = useState(percentComplete());
  const [seen, setSeen] = useState(() => localStorage.getItem(FLAG) === "true");

  const location = useLocation();
  const slugMatch = location.pathname.match(/^\/resources\/([^/]+)/);
  const slug = slugMatch ? slugMatch[1] : null;
  const isOnStart = location.pathname === "/start";
  const isOnStarterGuide = slug ? STARTER_SLUGS.includes(slug) : false;

  // mark as seen when user hits /start or a starter guide
  useEffect(() => {
    if ((isOnStart || isOnStarterGuide) && !seen) {
      localStorage.setItem(FLAG, "true");
      setSeen(true);
    }
  }, [isOnStart, isOnStarterGuide, seen]);

  // listen for progress updates
  useEffect(() => {
    const update = () => setPct(percentComplete());
    const off = onProgress(update);
    return off;
  }, []);

  // auto-hide if complete
  useEffect(() => {
    if (pct >= 100 && seen) {
      localStorage.removeItem(FLAG);
      setSeen(false);
    }
  }, [pct, seen]);

  const shouldShow = (seen || isOnStart || isOnStarterGuide) && pct < 100;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-gray-950/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-white whitespace-nowrap"
          onClick={() => setMenuOpen(false)}
        >
          Side Hustle Starter
        </Link>

        {/* ✨ Glowing Starter Path progress inline */}
        {shouldShow && (
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs relative">
            <span className="text-xs text-pink-300 whitespace-nowrap font-medium">
              Starter Path
            </span>
            <div className="h-2 flex-1 rounded-full bg-neutral-800 overflow-hidden relative">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 shadow-[0_0_10px_2px_rgba(255,107,53,0.4)] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
          </div>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-300 items-center">
          <Link to="/" className="hover:text-orange-400 transition">
            Home
          </Link>
          <Link to="/resources" className="hover:text-orange-400 transition">
            Resources
          </Link>
          <Link to="/start" className="hover:text-orange-400 transition">
            Start
          </Link>
          <Link to="/about" className="hover:text-orange-400 transition">
            About
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-md border-t border-gray-700 px-6 py-4 space-y-4 text-gray-300">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-orange-400 transition"
          >
            Home
          </Link>
          <Link
            to="/resources"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-orange-400 transition"
          >
            Resources
          </Link>
          <Link
            to="/start"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-orange-400 transition"
          >
            Start
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-orange-400 transition"
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
