// src/components/CoachTestWidget.jsx
import { useState } from "react";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hey! I’m the Side Hustle Starter Coach. I can help you shape your idea, map out a simple action plan, or figure out what to do next.\n\nWhat are you working with so far?",
};

const SUGGESTED_PROMPTS = [
  "I have a rough idea but I’m not sure if it’s good. Can you help me shape it?",
  "Can you help me create a simple 30-day plan to launch my side hustle?",
  "I have a full-time job. What’s a realistic way to start something on the side?",
  "I’m stuck and not sure what to do next. Can you help me decide?",
];

export default function CoachTestWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setLoading(true);

    // Add user message to the local history
    const newMessages = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    setInput("");

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
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        const answer = data.answer || "I’m not sure what to say yet, try rephrasing your question.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: answer },
        ]);
      }
    } catch (err) {
      console.error("Network error calling ask-coach:", err);
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  }

  function handlePromptClick(prompt) {
    // If they click a suggestion, send it directly
    sendMessage(prompt);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 text-sm">
      {/* Floating toggle button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:brightness-105"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-950/40 text-lg">
            💬
          </span>
          <span className="text-xs md:text-sm">Ask the Starter Coach</span>
        </button>
      )}

      {open && (
        <div className="w-[90vw] max-w-sm rounded-2xl border border-gray-700 bg-gray-900/95 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur p-4 text-gray-100 flex flex-col">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-lg">
                💡
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-100">
                  Side Hustle Starter Coach
                </div>
                <div className="text-[11px] text-gray-500">
                  Idea + action plan helper (beta)
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-200 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="mt-2 flex-1 min-h-[140px] max-h-72 overflow-y-auto rounded-lg bg-gray-950/40 px-2 py-2 space-y-2">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-orange-600 text-white rounded-br-sm"
                        : "bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700/60"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-700/60 bg-gray-800 px-3 py-2 text-[11px] text-gray-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce [animation-delay:0.3s]" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          {!loading && messages.length <= 2 && (
            <div className="mt-2 space-y-1">
              <p className="text-[11px] text-gray-500">
                Try one of these to get started:
              </p>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePromptClick(p)}
                    className="rounded-full border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] text-gray-200 hover:border-orange-500/70 hover:text-orange-200"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-2 text-[11px] text-red-400">
              {error}
            </p>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for help with your idea or next step..."
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-2 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <p className="mt-2 text-[10px] text-gray-500">
            Answers are educational only and not financial, legal, or tax advice.
          </p>
        </div>
      )}
    </div>
  );
}
