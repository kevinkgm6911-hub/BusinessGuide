// src/components/Funnel.jsx
import FunnelQuiz from "./FunnelQuiz";
import Reveal from "./Reveal";

export default function Funnel() {
  return (
    <section id="funnel" className="py-12 sm:py-16 lg:py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">
            Find Your Path
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl mx-auto">
            Answer a few quick questions to get your personalized guide.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="max-w-xl mx-auto">
            <FunnelQuiz />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
