import { useMemo, useState } from "react";

/**
 * Community Page
 * - Tailwind-first layout
 * - Dark theme w/ subtle neon accents
 * - Netlify Forms ready (contributor + email)
 * - Discord widget embed (enable in server settings)
 */

const HIGHLIGHTS = [
  {
    id: "t1",
    type: "topic",
    title: "How to pick a niche without overthinking it",
    summary:
      "Members share 3 quick tests to validate a niche in under 48 hours.",
    ctaLabel: "Read the thread",
    href: "#", // replace with deep link to Discord message if you enable message links
    badge: "🔥 Hot Topic",
  },
  {
    id: "r1",
    type: "resource",
    title: "Grant & micro-funding tracker (US/CA/UK)",
    summary:
      "A living spreadsheet of small grants and creator funds, curated by members.",
    ctaLabel: "Open resource",
    href: "#",
    badge: "💡 Member Resource",
  },
  {
    id: "s1",
    type: "story",
    title: "Etsy → LLC in 60 days",
    summary:
      "How Maya validated demand, set up her LLC, and made her first $1K from custom prints.",
    ctaLabel: "See story",
    href: "#",
    badge: "🚀 Success Story",
  },
];

export default function Community() {
  const [role, setRole] = useState("");

  const roles = useMemo(
    () => ["Creator", "Freelancer", "E-commerce", "Consultant", "Other"],
    []
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -inset-40 bg-gradient-to-tr from-pink-500/10 via-orange-500/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl/tight md:text-5xl font-semibold tracking-tight">
                You’re not building alone.
              </h1>
              <p className="mt-4 text-neutral-300">
                Join a welcoming community of first-time founders and creators
                making their first moves—asking questions, sharing resources, and
                taking action together.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={import.meta.env.VITE_DISCORD_INVITE || "#"}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                >
                  Join our Discord
                </a>
                <a
                  href="#contribute"
                  className="inline-flex items-center rounded-xl border border-neutral-700/80 bg-neutral-900 px-5 py-3 text-sm font-semibold hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                >
                  Contribute a Guide
                </a>
              </div>
              {/* Optional: light role picker (for future onboarding) */}
              <div className="mt-6">
                <label className="text-xs uppercase tracking-wide text-neutral-400">
                  I identify as…
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        role === r
                          ? "border-pink-500/50 bg-pink-500/10"
                          : "border-neutral-700 hover:border-neutral-600"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {role && (
                  <p className="mt-2 text-xs text-neutral-400">
                    Nice—{role}. You’ll see tailored channels & resources in
                    Discord soon.
                  </p>
                )}
              </div>
            </div>

            {/* Discord Widget Preview Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur">
              <div className="rounded-xl bg-neutral-950 p-2">
                {/* Replace with your server's widget ID after enabling it */}
                <iframe
                  title="Discord"
                  src={`https://discord.com/widget?id=${
                    import.meta.env.VITE_DISCORD_WIDGET_ID || "000000000000000000"
                  }&theme=dark`}
                  width="100%"
                  height="380"
                  allowTransparency
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="rounded-lg border border-neutral-800"
                />
              </div>
            
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Community Highlights</h2>
          <a
            href={import.meta.env.VITE_DISCORD_INVITE || "#"}
            className="text-sm text-pink-400 hover:text-pink-300"
          >
            See more in Discord →
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <a
              key={h.id}
              href={h.href}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:border-pink-500/40 hover:shadow-md hover:shadow-pink-500/10"
            >
              <span className="inline-flex items-center rounded-full border border-neutral-700/70 bg-neutral-950 px-3 py-1 text-xs text-neutral-300">
                {h.badge}
              </span>
              <h3 className="mt-3 text-lg font-semibold group-hover:text-neutral-50">
                {h.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">{h.summary}</p>
              <span className="mt-4 inline-block text-sm text-pink-400 group-hover:text-pink-300">
                {h.ctaLabel} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Contributor Callout */}
      <section
        id="contribute"
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-12"
      >
        <div className="pointer-events-none absolute -inset-24 -z-10 bg-[radial-gradient(80%_60%_at_80%_0%,rgba(236,72,153,0.12),transparent_60%),radial-gradient(60%_40%_at_0%_100%,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Become a Guide Contributor</h2>
            <p className="mt-2 text-neutral-300">
              Help others start faster by writing state/country or
              industry-specific guides. We’ll provide a template, editing support,
              and give you full credit on the site.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>• Regional guides (e.g., US-NY, Canada-ON, UK)</li>
              <li>• Industry guides (e.g., Etsy, freelance design, food pop-ups)</li>
              <li>• Checklists + links to official forms</li>
            </ul>
          </div>

          {/* Netlify Forms-ready form */}
          <form
            name="contributor-application"
            method="POST"
            data-netlify="true"
            className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5"
          >
            <input type="hidden" name="form-name" value="contributor-application" />
            <div className="grid gap-4">
              <div className="grid gap-1">
                <label className="text-sm text-neutral-300">Name</label>
                <input
                  name="name"
                  required
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-pink-500"
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-neutral-300">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-pink-500"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-neutral-300">
                  Region(s) or Industry Focus
                </label>
                <input
                  name="focus"
                  required
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-pink-500"
                  placeholder="e.g., US-NY LLC, UK sole trader, Etsy print-on-demand"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-neutral-300">
                  Example / Experience (optional)
                </label>
                <textarea
                  name="experience"
                  rows={4}
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-pink-500"
                  placeholder="Tell us briefly about your experience or why you want to contribute."
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 hover:opacity-95"
              >
                Apply to Contribute
              </button>
              <p className="text-xs text-neutral-400">
                Submitting this form shares your info with the Side Hustle Starter team.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Events / Collaboration */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Monthly Themes & Collabs</h3>
              <p className="mt-1 text-neutral-300">
                Join live working sessions: <span className="text-neutral-200">Website Wednesday</span>,{" "}
                <span className="text-neutral-200">Pitch Practice</span>, and{" "}
                <span className="text-neutral-200">Tool Talk</span>. Post questions early in Discord—we’ll
                pull highlights into the session.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm hover:border-neutral-600"
            >
              View Calendar (Coming soon)
            </a>
          </div>
        </div>
      </section>

      {/* Email Opt-in */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h3 className="text-xl font-semibold">Get monthly community highlights</h3>
          <p className="mt-1 text-neutral-300">
            A short digest with new guides, top discussions, and upcoming sessions.
          </p>
          {/* Netlify Forms-ready (swap to Resend/Supabase later) */}
          <form
            name="community-email"
            method="POST"
            data-netlify="true"
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="form-name" value="community-email" />
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 hover:opacity-95"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-xs text-neutral-500">
            We respect inboxes. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h3 className="text-xl font-semibold">Community FAQ</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <h4 className="font-semibold">Is the Discord beginner-friendly?</h4>
            <p className="mt-1 text-neutral-300">
              Absolutely. We expect newbie questions and celebrate first wins.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <h4 className="font-semibold">How do I become a contributor?</h4>
            <p className="mt-1 text-neutral-300">
              Apply above with your region/industry focus. We’ll send a guide template
              and pair you with an editor.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <h4 className="font-semibold">Do you host events?</h4>
            <p className="mt-1 text-neutral-300">
              We’re rolling out monthly themes and working sessions. Watch the calendar.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <h4 className="font-semibold">Can I share my own resources?</h4>
            <p className="mt-1 text-neutral-300">
              Yes—post in <span className="text-neutral-200">#resources</span>. Great finds may be featured
              on this page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
