export default function CommunityBlock() {
  return (
    <section id="community" className="relative bg-gray-900 text-center overflow-hidden">
      {/* Top Divider with Orange Accent */}
      <div className="absolute -top-[1px] left-0 right-0 text-orange-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 150" className="w-full h-[80px]" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,85.3C840,75,960,117,1080,138.7C1200,160,1320,160,1380,160L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>

      {/* Orange Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-700/30 via-orange-600/20 to-orange-700/30 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          🚀 Join Our Community
        </h2>
        <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-300">
          Get exclusive resources, connect with fellow entrepreneurs, and never miss an update.
        </p>

        {/* Grid: force equal height */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
          {/* Discord Card */}
          <div className="flex flex-col bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">💬 Our Discord</h3>
            <p className="text-gray-300 mb-6">
              Chat with entrepreneurs, share wins, and get feedback in real time.
            </p>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700 flex-1">
              <iframe
                src="https://discord.com/widget?id=1421217420210733108&theme=dark"
                width="100%"
                height="100%"
                style={{ minHeight: "350px" }}
                allowTransparency="true"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              ></iframe>
            </div>
          </div>

          {/* Email Card */}
          <div className="flex flex-col bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">📬 Stay in the Loop</h3>
            <p className="text-gray-300 mb-6">
              Get updates on new resources and guides straight to your inbox.
            </p>
            <div className="flex-1 flex flex-col justify-end">
              <form>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled
                  className="w-full mt-4 px-6 py-3 rounded-lg bg-gray-600 text-gray-400 cursor-not-allowed"
                >
                  Coming Soon ⏳
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute -bottom-[1px] left-0 right-0 text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 150" className="w-full h-[80px] rotate-180" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,85.3C840,75,960,117,1080,138.7C1200,160,1320,160,1380,160L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
}
