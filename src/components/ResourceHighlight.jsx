import Reveal from "./Reveal";

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
          📘 Hero Resource
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-gray-300">
          Download our free{" "}
          <strong className="text-white">Side Hustle Starter Guide</strong> and
          learn the first 5 steps to kick off your business with confidence.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <a
          href="/starter-guide.pdf"
          className="inline-block px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-lg font-semibold shadow-lg shadow-orange-500/30"
        >
          📥 Download Now
        </a>
      </Reveal>
    </section>
  );
}
