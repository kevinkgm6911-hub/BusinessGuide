// src/components/CoachTestWidget.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  STARTER_SLUGS,
  loadProgress,
  percentComplete,
  nextIncomplete,
} from "../lib/progress";
import { useAuth } from "../context/AuthContext";

function buildStarterProgressPayload() {
  const progress = loadProgress();
  const percent = percentComplete();
  const doneSlugs = STARTER_SLUGS.filter((slug) => progress[slug]);
  const nextSlug = nextIncomplete();

  return {
    percent,
    doneSlugs,
    nextSlug,
  };
}

export default function CoachTestWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "coach",
      text: `Hey! I’m the Side Hustle Starter Coach.

I can help you:
• Clarify or refine your idea
• Build a simple action plan
• Decide what to do next
• Find the right guides on this site

To start, tell me where you're at:
- “I have no idea what to start.”
- “I have an idea but I’m stuck.”
- “I want help planning my next steps.”`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const starterPercent = percentComplete();
  const nextSlug = nextIncomplete();
  const starterDone = starterPercent >= 100;

  // Persist messages per-user in localStorage (simple client-side memory)
  useEffect(() => {
    try {
      const key = user
        ? `coachWidget:messages:${user.id}`
        : "coachWidget:messages:guest";
      const saved = localStorage.getItem(key);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      const key = user
        ? `coachWidget:messages:${user.id}`
        : "coachWidget:messages:guest";
      localStorage.setItem(key, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages, user]);

  async function handleSend(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setErrorText("");
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          pageContext: window.location.pathname,
          starterProgress: buildStarterProgressPayload(),
          userId: user?.id || null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ask-coach failed", res.status, text);
        setErrorText(
          "Sorry, something went wrong talking to the coach. Please try again in a moment."
        );
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "coach", text: data.reply || "(no reply)" },
      ]);
    } catch (err) {
      console.error("Network error calling ask-coach", err);
      setErrorText(
        "Network error reaching the coach. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/40 hover:opacity-95"
      >
        💬 Ask the Coach
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative flex h-[80vh] w-full max-w-5xl flex-col md:flex-row rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
            {/* Left: Chat */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-gray-800 px-5 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Side Hustle Starter Coach
                  </h2>
                  <p className="text-xs text-gray-400">
                    Ask about your idea, next steps, or which guide to use.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-200 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-sm">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 whitespace-pre-wrap ${
                        m.from === "user"
                          ? "bg-orange-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-xs text-gray-400">Coach is thinking…</div>
                )}
                {errorText && (
                  <div className="text-xs text-red-400">{errorText}</div>
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="border-t border-gray-800 px-5 py-3 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell me what you're working on…"
                  className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Right: Context panel */}
            <aside className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-950 p-4 flex flex-col gap-4 text-xs">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  Starter Path
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
                      style={{ width: `${starterPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {starterPercent}%
                  </span>
                </div>
                {starterDone ? (
                  <p className="text-[11px] text-pink-300">
                    🎉 You’ve finished the Starter Path.
                  </p>
                ) : nextSlug ? (
                  <p className="text-[11px] text-gray-300">
                    Next guide:{" "}
                    <Link
                      to={`/resources/${nextSlug}`}
                      className="text-orange-400 hover:underline"
                    >
                      {nextSlug}
                    </Link>
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-300">
                    Start with the{" "}
                    <Link
                      to="/start"
                      className="text-orange-400 hover:underline"
                    >
                      Starter Path
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div className="border-t border-gray-800 pt-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  Profile
                </h3>
                {user ? (
                  <>
                    <p className="text-[11px] text-gray-300 mb-1">
                      Signed in as{" "}
                      <span className="font-medium">{user.email}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mb-2">
                      The coach uses your profile to personalize advice.
                    </p>
                    <Link
                      to="/profile"
                      className="inline-flex items-center rounded-full border border-gray-700 px-2 py-1 text-[11px] text-gray-200 hover:border-orange-500 hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      Edit profile →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] text-gray-300 mb-2">
                      Log in to create a profile so the coach can remember your
                      goals across sessions.
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Use the “Log in” button in the top navigation.
                    </p>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
