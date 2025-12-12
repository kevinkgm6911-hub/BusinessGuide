// src/pages/About.jsx
export default function About() {
  return (
    <div className="pb-10">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
            👋 About Us
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl mx-auto">
            Helping entrepreneurs turn ideas into action with clarity, tools, and
            community support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 md:items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              Side Hustle Starter was built to help aspiring entrepreneurs move
              from idea to action. We believe starting a business shouldn’t feel
              intimidating — and with the right tools and guidance, anyone can
              build something meaningful.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
              Here you’ll find curated guides, checklists, and resources designed
              to save you time and help you focus on what matters most: launching
              your ideas. Plus, our community gives you a chance to connect with
              others on the same path.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"
              alt="Entrepreneurs collaborating in a workshop"
              className="rounded-2xl shadow-lg max-w-xs sm:max-w-sm md:max-w-md w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            ✨ What We Stand For
          </h2>
          <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-300">
            <li>✅ Making entrepreneurship simple and accessible</li>
            <li>✅ Encouraging action over perfection</li>
            <li>✅ Building a supportive, inclusive community</li>
            <li>✅ Sharing tools that actually work</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8">
            Check out our resources or join the community to take your next step.
          </p>
          <a
            href="/resources"
            className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-orange-600 hover:bg-orange-700 transition font-semibold text-sm sm:text-base"
          >
            Explore Resources 🚀
          </a>
        </div>
      </section>
    </div>
  );
}
