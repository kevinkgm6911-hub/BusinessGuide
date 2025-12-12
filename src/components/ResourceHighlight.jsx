// src/components/ResourceHighlight.jsx
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { percentComplete } from "../lib/progress";

export default function ResourceHighlight() {
  const pct = percentComplete();
  const hasStarted = pct > 0;
  const ctaLabel = hasStarted
    ? `Continue Starter Path (${pct}% done)`
    : "Start the Starter Path";

  return (
    <section
      id="resources"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gray-900"
    >
      {/* Soft glowing background accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-500/10 via-pink-600/10 to-transparent blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
            ✨ Start with the Starter Path
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="max-w-2xl mx-auto mb-8 text-sm sm:text-base md:text-lg text-gray-300">
            Not sure where to begin? Follow a guided 5-step path that takes you
            from{" "}
            <span className="text-white font-semibold">
              “I want to start something”
            </span>{" "}
            to{" "}
            <span className="text-white font-semibold">
              “I’ve actually launched.”
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <Link
            to="/start"
            className="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-sm sm:text-base md:text-lg font-semibold shadow-lg shadow-orange-500/30"
          >
            {ctaLabel}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
