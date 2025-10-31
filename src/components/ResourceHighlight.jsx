import Reveal from "./Reveal";
import { Link } from "react-router-dom";

export default function ResourceHighlight() {
  return (
    <section
      id="resources"
      className="relative py-24 px-6 bg-gray-900 text-center overflow-hidden"
    >
      {/* Soft glowing background accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-500/10 via-pink-600/10 to-transparent blur-3xl" />

      <Reveal>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          🚀 Start Your Side Hustle Journey
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-gray-300">
          Ready to launch but not sure where to begin? Follow our{" "}
          <strong className="text-white">5-Step Starter Path</strong> — a free,
          hands-on guide designed to take you from “idea” to “action.”
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <Link
          to="/start"
          className="inline-block px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-lg font-semibold shadow-lg shadow-orange-500/30"
        >
          ✨ Begin the Starter Path
        </Link>
      </Reveal>
    </section>
  );
}
