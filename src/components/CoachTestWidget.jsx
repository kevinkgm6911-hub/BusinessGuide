// src/components/CoachTestWidget.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  percentComplete,
  nextIncomplete,
  STARTER_SLUGS,
  isComplete as progressIsComplete,
} from "../lib/progress";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hey! I’m the Side Hustle Starter Coach. I can help you shape your idea, map out a simple action plan, or figure out what to do next.\n\nWhat are you working with so far?",
};

const SUGGESTED_PROMPTS = [
  "I have a rough idea but I’m not sure if it’s good. Can you help me shape it?",
  "Can you help me create a simple 30-day plan to launch my side hustle?",
  "I have a full-time job. What's a realistic way to start something?",
  "I’m stuck and not sure what to do next. Can you help me decide?",
];

export default function CoachTestWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function buildStarterProgressPayload() {
    return {
      percent: percentComplete(),
      totalSteps: STARTER_SLUGS.length,
      nextSlug: nextIncomplete() || null,
      isComplete: progressIsComplete(),
    };
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setLoading(true);

    const updated = [...messages, { role: "user", content: trimmed }];
    setMessages(updated);
    setInput("");

    try {
      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          pageContext: window.location.pathname,
          starterProgress: buildStarterProgressPayload(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err) {
      console.error("API error:", err);
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) sendMessage(input);
  }

  function handlePromptClick(text) {
    sendMessage(text);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-lg"
        >
          <span className="text-lg">💬</span>
          <span className="text-xs md:text-sm">Starter Coach</span>
        </button>
      )}

      {/* Fullscreen modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl border border-gray-700 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500">
                  💡
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-100">
                    Side Hustle Starter Coach
                  </h2>
                  <p className="text-[11px] text-gray-500">Beta assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 text-xs text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col md:flex-row">
              {/* Messages */}
              <div className="flex-1 px-5 py-4 flex flex-col">
                <div className="flex-1 overflow-y-auto rounded-xl bg-gray-950/40 p-3 space-y-3 max-h-[55vh]">
                  {messages.map((msg, i) => {
                    const user = msg.role === "user";
                    return (
                      <div
                        key={i}
                        className={`flex ${user ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl max-w-[80%] text-xs md:text-sm ${
                            user
                              ? "bg-orange-600 text-white rounded-br-sm"
                              : "bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700"
                          }`}
                        >
                          {user ? (
                            msg.content
                          ) : (
                            <ReactMarkdown
                              components={{
                                a: ({ href, children, ...props }) => {
                                  // INTERNAL LINK → SPA nav
                                  if (href && href.startsWith("/")) {
                                    return (
                                      <a
                                        {...props}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          navigate(href);
                                        }}
                                        className="text-orange-400 underline hover:text-orange-300 cursor-pointer"
                                      >
                                        {children}
                                      </a>
                                    );
                                  }
                                  // EXTERNAL LINK
                                  return (
                                    <a
                                      {...props}
                                      href={href}
                                      target="_blank"
                                      className="text-orange-400 underline hover:text-orange-300"
                                    >
                                      {children}
                                    </a>
                                  );
                                },
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="text-gray-400 text-xs">Thinking…</div>
                  )}
                </div>

                {error && (
                  <p className="mt-2 text-xs text-red-400">{error}</p>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something…"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-xs md:text-sm"
                  />
                  <button
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white text-xs md:text-sm disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Suggested prompts */}
              <div className="border-t border-gray-800 md:border-t-0 md:border-l px-4 py-4 w-full md:w-64 space-y-2">
                <p className="text-gray-300 text-xs font-semibold">
                  Try asking:
                </p>
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(p)}
                    className="block w-full text-left text-[11px] text-gray-300 px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 hover:border-orange-500 hover:text-orange-200"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
