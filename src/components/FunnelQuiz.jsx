import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

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

export default function FunnelQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (answer) => {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);

    if (step < questions.length) {
      setStep(step + 1);
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
            transition={{ duration: 0.45 }}
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
            className="bg-gray-700 p-8 rounded-2xl shadow-lg text-white text-center"
          >
            <h3 className="text-3xl font-bold mb-4">
              You’re in the right place
            </h3>

            <p className="mb-6 text-gray-200">
              Based on your answers, the best next move is to follow a simple,
              structured path that helps you go from idea → action → launch
              without overthinking it.
            </p>

            <Link
              to="/start"
              className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 hover:opacity-95 transition"
            >
              🚀 Start the Starter Path
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              Takes about 60–90 minutes total • No commitment required
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
