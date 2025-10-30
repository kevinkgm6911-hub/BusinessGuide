import { motion } from "framer-motion"; 

 

 

export default function Hero() { 

  return ( 

    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden"> 

      {/* Background gradient layer */} 

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900" /> 

 

      {/* Decorative blobs */} 

      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl -z-10 animate-pulse" /> 

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl -z-10 animate-pulse" /> 

 

      {/* Headline */} 

      <motion.h1 

        initial={{ opacity: 0, y: 40 }} 

        animate={{ opacity: 1, y: 0 }} 

        transition={{ duration: 1 }} 

        className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent" 

      > 

        Start Your Side Hustle Today 

      </motion.h1> 

 

      {/* Tagline */} 

      <motion.p 

        initial={{ opacity: 0 }} 

        animate={{ opacity: 1 }} 

        transition={{ delay: 0.6, duration: 1 }} 

        className="mt-6 text-xl md:text-2xl max-w-2xl text-gray-300" 

      > 

        Tools, guides, and a community built to help wannabe entrepreneurs take 

        the first step — and actually make it happen. 

      </motion.p> 

 

      {/* Call-to-action buttons */} 

      <motion.div 

        initial={{ opacity: 0, y: 20 }} 

        animate={{ opacity: 1, y: 0 }} 

        transition={{ delay: 1.2, duration: 1 }} 

        className="mt-10 flex flex-col md:flex-row gap-4" 

      > 

        <a 

          href="#funnel" 

          className="px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 transition text-lg font-semibold" 

        > 

          Find My Path 🚀 

        </a> 

        <a 

          href="/resources" 

          className="px-8 py-4 rounded-xl border border-gray-600 hover:border-white transition text-lg font-semibold" 

        > 

          Explore Resources 📚 

        </a> 

      </motion.div> 

 

      {/* Scroll indicator */} 

      <motion.div 

        initial={{ opacity: 0 }} 

        animate={{ opacity: 1 }} 

        transition={{ delay: 1.8, duration: 1 }} 

        className="absolute bottom-6 text-gray-400 animate-bounce" 

      > 

        ↓ Scroll 

      </motion.div> 

    </section> 

  ); 

} 