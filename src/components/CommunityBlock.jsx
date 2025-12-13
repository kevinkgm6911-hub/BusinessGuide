// src/components/CommunityBlock.jsx
const DISCORD_INVITE = "https://discord.gg/xavjmPUtas";

export default function CommunityBlock() {
  return (
    <section
      id="community"
      className="relative bg-gray-900 text-center overflow-hidden"
    >
      {/* Top Divider with Orange Accent */}
      <div className="absolute -top-[1px] left-0 right-0 text-orange-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 150"
          className="w-full h-[60px] sm:h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,85.3C840,75,960,117,1080,138.7C1200,160,1320,160,1380,160L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>

      {/* Orange Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-700/30 via-orange-600/20 to-orange-700/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 text-white">
            🚀 Join Our Community
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-sm sm:text-base md:text-lg text-gray-300">
            Get resources, ask questions, share wins, and build alongside other
            first-time entrepreneurs.
          </p>

          {/* Grid */}
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto items-stretch">
            {/* Discord Card */}
            <div className="flex flex-col bg-gray-800 rounded-xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    💬 Our Discord
                  </h3>
                  <p className="text-gray-300 mt-2 text-sm sm:text-base">
                    Chat with entrepreneurs, share resources, and get feedback in
                    real time.
                  </p>
                </div>
              </div>

              {/* Join button */}
              <div className="mt-2 mb-5 flex flex-col sm:flex-row gap-3">
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-orange-500/30 hover:opacity-95 transition"
                >
                  Join Discord →
                </a>
                <a
                  href="/community"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm sm:text-base font-semibold text-gray-100 hover:border-gray-600 transition"
                >
                  What to do inside →
                </a>
              </div>

              {/* Preview widget */}
              <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700 flex-1">
                <iframe
                  src="https://discord.com/widget?id=1421217420210733108&theme=dark"
                  width="100%"
                  height="100%"
                  style={{ minHeight: "260px" }}
                  allowTransparency="true"
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  title="Side Hustle Starter Discord"
                />
              </div>

              <p className="mt-3 text-left text-xs text-gray-400">
                Tip: Introduce yourself and post your idea in <span className="text-gray-200">#start-here</span>.
              </p>
            </div>

            {/* Email Card */}
            <div
              id="newsletter"
              className="flex flex-col bg-gray-800 rounded-xl p-5 sm:p-6 shadow-lg"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">
                📬 Email Updates
              </h3>
              <p className="text-gray-300 mb-5 text-sm sm:text-base">
                Weekly-ish updates when new guides, templates, and improvements drop.
              </p>

              <div className="flex-1 flex flex-col justify-end">
                <div className="rounded-xl border border-pink-500/25 bg-pink-500/10 p-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏳</span>
                    <p className="text-sm sm:text-base font-semibold text-pink-200">
                      Coming soon
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">
                    Email signup is being wired up next. For now, the best way to
                    stay close is the Discord.
                  </p>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={DISCORD_INVITE}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm sm:text-base font-semibold text-white hover:bg-orange-700 transition"
                    >
                      Join Discord →
                    </a>
                    <a
                      href="/resources"
                      className="inline-flex items-center justify-center rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm sm:text-base font-semibold text-gray-100 hover:border-gray-600 transition"
                    >
                      Browse Guides →
                    </a>
                  </div>
                </div>

                <p className="mt-3 text-left text-xs text-gray-400">
                  When email launches, we’ll keep it practical. No spam, no hustle-culture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute -bottom-[1px] left-0 right-0 text-gray-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 150"
          className="w-full h-[60px] sm:h-[80px] rotate-180"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,85.3C840,75,960,117,1080,138.7C1200,160,1320,160,1380,160L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
}
