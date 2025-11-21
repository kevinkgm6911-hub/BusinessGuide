// src/components/CoachTestWidget.jsx
import { useState } from "react";

export default function CoachTestWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(e) {
    e.preventDefault();
    setError("");
    setAnswer("");
    const trimmed = message.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          pageContext: window.location.pathname,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("ask-coach error:", data);
        setError(data.error || "Something went wrong.");
      } else {
        setAnswer(data.answer || "");
      }
    } catch (err) {
      console.error("Network error calling ask-coach:", err);
      setError("Network error. Check the console/logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 text-sm">
      {/* Toggle button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600"
        >
          💬 Test AI Coach
        </button>
      )}

      {open && (
        <div className="w-80 rounded-2xl border border-gray-700 bg-gray-900/95 shadow-2xl backdrop-blur p-4 text-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
              Side Hustle Starter Coach (Test)
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-200 text-xs"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSend} className="space-y-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something like: 'Can you help me shape my dog-walking side hustle idea?'"
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-2 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? "Thinking..." : "Send to Coach"}
            </button>
          </form>

          {error && (
            <p className="mt-2 text-xs text-red-400">
              {error}
            </p>
          )}

          {answer && (
            <div className="mt-3 max-h-40 overflow-y-auto rounded-md bg-gray-800/70 px-2 py-2 text-xs text-gray-100">
              {answer}
            </div>
          )}

          {!answer && !error && !loading && (
            <p className="mt-2 text-[11px] text-gray-500">
              This is a test integration calling the{" "}
              <code>ask-coach</code> Netlify function. It uses your
              OpenAI API key from Netlify environment variables.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
