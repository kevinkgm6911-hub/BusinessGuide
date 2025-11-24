// src/components/CoachTestWidget.jsx
import { useEffect, useState } from "react";
import {
  STARTER_SLUGS,
  loadProgress,
  percentComplete,
  nextIncomplete,
} from "../lib/progress";

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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "coach",
      text: `Hey! I’m the Side Hustle Starter Coach.

I can help you:
• Clarify your side hustle idea
• Build a simple action plan
• Decide what to do next
• Find the right guides on this site

To get started, tell me where you’re at:
- “I have no idea what to start.”
- “I have an idea but I’m stuck.”
- “I want help planning my next steps.”`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Optional: keep widget state in localStorage so it feels persistent
  useEffect(() => {
    try {
      const saved = localStorage.getItem("coachWidget:messages");
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "coachWidget:messages",
        JSON.stringify(messages)
      );
    } catch {
      // ignore
    }
  }, [messages]);

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
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/40 hover:opacity-95"
      >
        💬 Ask the Coach
      </button>

      {/* Full-screen-ish overlay when open */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative flex h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            {/* Header */}
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

            {/* Messages */}
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

            {/* Input */}
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
        </div>
      )}
    </>
  );
}
