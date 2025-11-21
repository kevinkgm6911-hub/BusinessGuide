// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-300 items-center">
          <Link
            to="/"
            className="hover:text-orange-400 transition"
          >
            Home
          </Link>
          <Link
            to="/resources"
            className="hover:text-orange-400 transition"
          >
            Resources
          </Link>
          <Link
            to="/start"
            className="hover:text-orange-400 transition"
          >
            Start
          </Link>
          <Link
            to="/community"
            className="hover:text-orange-400 transition"
          >
            Community
          </Link>
          <Link
            to="/about"
            className="hover:text-orange-400 transition"
          >
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
            to="/community"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-orange-400 transition"
          >
            Community
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
