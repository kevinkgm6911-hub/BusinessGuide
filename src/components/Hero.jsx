// src/components/Hero.jsx
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-4rem)] items-center py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Background gradient layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Decorative blobs */}
      <div className="absolute top-16 left-[-3rem] w-56 h-56 sm:w-72 sm:h-72 bg-pink-600/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-[-3rem] w-64 h-64 sm:w-80 sm:h-80 bg-orange-600/20 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent"
        >
          Start Your Side Hustle Today
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-gray-300"
        >
          Tools, guides, and a community built to help wannabe entrepreneurs
          take the first step — and actually make it happen.
        </motion.p>

        {/* Call-to-action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="#funnel"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-orange-600 hover:bg-orange-700 transition text-sm sm:text-base md:text-lg font-semibold"
          >
            Find My Path 🚀
          </a>
          <a
            href="/resources"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-gray-600 hover:border-white transition text-sm sm:text-base md:text-lg font-semibold"
          >
            Explore Resources 📚
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="pointer-events-none absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-gray-400 animate-bounce"
      >
        ↓ Scroll
      </motion.div>
    </section>
  );
}
