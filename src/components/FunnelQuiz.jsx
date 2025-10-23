import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    id: 1,
    text: "What’s your main goal right now?",
    options: [
      "Start a side hustle for extra income",
      "Turn a hobby into a business",
      "Go full-time entrepreneur",
    ],
  },
  {
    id: 2,
    text: "What’s your starting budget?",
    options: ["$0–$100", "$100–$1000", "$1000+"],
  },
  {
    id: 3,
    text: "How much time can you invest per week?",
    options: ["5 hours", "10–20 hours", "20+ hours"],
  },
];

function getRecommendation(answers) {
  const [goal, budget] = answers;

  if (goal === "Start a side hustle for extra income" && budget === "$0–$100") {
    return {
      title: "Quick Wins Side Hustles",
      description:
        "Low-cost, fast-start ideas you can launch this month to generate extra cash.",
      link: "/quick-wins-guide.pdf",
    };
  }

  if (goal === "Turn a hobby into a business") {
    return {
      title: "Turn Your Passion into Income Guide",
      description:
        "Learn how to validate your hobby, build your first audience, and earn your first sales.",
      link: "/hobby-to-business-guide.pdf",
    };
  }

  if (goal === "Go full-time entrepreneur") {
    return {
      title: "Business Plan & Funding Toolkit",
      description:
        "A complete template and resource pack to plan, pitch, and secure funding.",
      link: "/business-plan-toolkit.pdf",
    };
  }

  return {
    title: "Side Hustle Starter Guide",
    description: "Covers the exact first steps to start a small business.",
    link: "/starter-guide.pdf",
  };
}

export default function FunnelQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1); // show results
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {step < questions.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-700 p-8 rounded-2xl shadow-lg text-white"
          >
            <h3 className="text-2xl font-bold mb-6">
              {questions[step].text}
            </h3>
            <div className="flex flex-col gap-4">
              {questions[step].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition text-white"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-300">
              Step {step + 1} of {questions.length}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-700 p-8 rounded-2xl shadow-lg text-white"
          >
            {(() => {
              const rec = getRecommendation(answers);
              return (
                <>
                  <h3 className="text-3xl font-bold mb-4">{rec.title}</h3>
                  <p className="mb-6">{rec.description}</p>
                  <a
                    href={rec.link}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 transition"
                  >
                    📥 Download Guide
                  </a>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
