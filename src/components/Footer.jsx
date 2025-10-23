import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Side Hustle Starter</h3>
          <p className="text-sm">
            Helping wannabe entrepreneurs turn ideas into action with the right
            tools, guides, and community support.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-orange-400 transition">
                Resources
              </Link>
            </li>
            <li>
              <a href="/#community" className="hover:text-orange-400 transition">
                Community
              </a>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-400 transition">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition"
              >
                Join our Discord
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition"
              >
                Follow on Twitter
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@sidehustlestarter.com"
                className="hover:text-orange-400 transition"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom note */}
      <div className="text-center text-xs text-gray-600 mt-10">
        © {new Date().getFullYear()} Side Hustle Starter. All rights reserved.
      </div>
    </footer>
  );
}
