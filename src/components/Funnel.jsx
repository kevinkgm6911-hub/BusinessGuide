import FunnelQuiz from "./FunnelQuiz";
import Reveal from "./Reveal";

export default function Funnel() {
  return (
    <section id="funnel" className="py-24 bg-gray-800 text-center">
      <Reveal>
        <h2 className="text-4xl font-bold mb-10 text-white">Find Your Path</h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="text-gray-300 mb-8">
          Answer a few quick questions to get your personalized guide.
        </p>
      </Reveal>
      <Reveal delay={0.4}>
        <FunnelQuiz />
      </Reveal>
    </section>
  );
}
