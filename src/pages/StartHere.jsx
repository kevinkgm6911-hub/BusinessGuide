import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  STARTER_SLUGS,
  loadProgress,
  setDone,
  resetProgress,
  nextIncomplete,
  percentComplete,
  isDone,
} from "../lib/progress";

const GUIDE_META = {
  "choose-your-side-hustle": {
    title: "How to Choose a Side Hustle That Fits You",
    excerpt: "Find an idea at the intersection of enjoyment, skill, and real demand.",
    duration: "20 min",
    category: "Start",
  },
  "first-action-plan": {
    title: "From Idea to First Action Plan",
    excerpt: "Turn your idea into a focused 30-day roadmap with weekly milestones.",
    duration: "20 min",
    category: "Start",
  },
  "budgeting-setup": {
    title: "Budgeting & Financial Setup for Beginners",
    excerpt: "Separate money, track basics, and set simple tax/savings buckets.",
    duration: "20 min",
    category: "Start",
  },
  "brand-basics": {
    title: "Name, Brand & Simple Logo Design",
    excerpt: "Pick a name, personality, and create a clean, usable logo fast.",
    duration: "25 min",
    category: "Start",
  },
  "launch-your-first-page": {
    title: "Launch Your First Page (Your Simple Online Presence)",
    excerpt: "Publish one clear page with a single CTA — then share it.",
    duration: "25 min",
    category: "Start",
  },
};

export default function StartHere() {
  const nav = useNavigate();
  const [progress, setProgress] = useState(loadProgress());
  const pct = useMemo(() => percentComplete(), [progress]);
  const next = useMemo(() => nextIncomplete(), [progress]);

  useEffect(() => {
    // re-read progress if other tabs/pages change it
    const onFocus = () => setProgress(loadProgress());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function toggle(slug) {
    const newVal = !isDone(slug);
    setDone(slug, newVal);
    setProgress(loadProgress());
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold">🚀 Start Here</h1>
          <p className="mt-3 text-lg text-gray-300">
            A 5-step path that takes you from “I want to start something” → “I’m live.”
          </p>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{pct}% complete</span>
              <button
                onClick={() => { resetProgress(); setProgress(loadProgress()); }}
                className="ml-auto rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-600"
              >
                Reset
              </button>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-neutral-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>

            {/* Continue button */}
            <div className="mt-4">
              {next ? (
                <button
                  onClick={() => nav(`/resources/${next}`)}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 text-sm font-semibold shadow-lg shadow-orange-500/20 hover:opacity-95"
                >
                  Continue where you left off →
                </button>
              ) : (
                <span className="text-sm text-pink-300">
                  🎉 You finished the Starter Path!
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Cards */}
        <ol className="grid gap-6 md:grid-cols-2">
          {STARTER_SLUGS.map((slug, idx) => {
            const meta = GUIDE_META[slug];
            const done = isDone(slug);
            return (
              <li key={slug} className="relative">
                <div
                  className={`rounded-2xl border p-5 transition ${
                    done
                      ? "border-pink-500/40 bg-pink-500/10"
                      : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-orange-300">{meta.category}</span>
                    {done && (
                      <span className="ml-auto rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[11px] text-pink-300">
                        Done
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold">{meta.title}</h3>
                  <p className="mt-2 text-sm text-gray-300">{meta.excerpt}</p>
                  <p className="mt-1 text-xs text-gray-500">{meta.duration}</p>

                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      to={`/resources/${slug}`}
                      className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold hover:bg-orange-700"
                    >
                      Open guide →
                    </Link>
                    <button
                      onClick={() => toggle(slug)}
                      className={`rounded-lg border px-3 py-1.5 text-xs ${
                        done
                          ? "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:border-pink-500/60"
                          : "border-neutral-700 bg-neutral-950 text-neutral-300 hover:border-neutral-600"
                      }`}
                    >
                      {done ? "Mark as not done" : "Mark as done"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
