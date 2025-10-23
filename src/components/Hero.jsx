export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-6">
        Start Your Side Hustle Today
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
        Explore tools, resources, and community designed to help you build
        your first business — without the guesswork.
      </p>

      <div className="mt-10 flex flex-col md:flex-row gap-4">
        <a
          href="/resources"
          className="px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 transition text-lg font-semibold"
        >
          Explore Resources 🚀
        </a>
        <a
          href="/community"
          className="px-8 py-4 rounded-xl border border-gray-600 hover:border-gray-400 transition text-lg font-semibold"
        >
          Join the Community 💬
        </a>
      </div>
    </section>
  );
}
