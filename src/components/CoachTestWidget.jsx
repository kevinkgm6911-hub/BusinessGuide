// src/components/CoachTestWidget.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  percentComplete,
  nextIncomplete,
  STARTER_SLUGS,
  isComplete as progressIsComplete,
} from "../lib/progress";
import { useAuth } from "../context/AuthContext"; // ⬅ NEW

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

const STORAGE_KEY_MESSAGES = "shs-coach-thread:v1";
const STORAGE_KEY_OPEN = "shs-coach-open:v1";

// helpers to safely access localStorage
function loadStoredMessages() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return [INITIAL_MESSAGE];
    }
    const raw = window.localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return [INITIAL_MESSAGE];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [INITIAL_MESSAGE];
    }
    return parsed;
  } catch {
    return [INITIAL_MESSAGE];
  }
}

function loadStoredOpen() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY_OPEN);
    return raw === "true";
  } catch {
    return false;
  }
}

export default function CoachTestWidget() {
  const navigate = useNavigate();
  const { user, session } = useAuth(); // ⬅ NEW

  // hydrate from localStorage on first render
  const [open, setOpen] = useState(() => loadStoredOpen());
  const [messages, setMessages] = useState(() => loadStoredMessages());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      // keep only most recent 40 messages to avoid unbounded growth
      const trimmed =
        messages.length > 40 ? messages.slice(messages.length - 40) : messages;
      window.localStorage.setItem(
        STORAGE_KEY_MESSAGES,
        JSON.stringify(trimmed)
      );
    } catch {
      // ignore
    }
  }, [messages]);

  // persist open/closed state
  useEffect(() => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.setItem(STORAGE_KEY_OPEN, open ? "true" : "false");
    } catch {
      // ignore
    }
  }, [open]);

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
      const headers = {
        "Content-Type": "application/json",
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      };

      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: trimmed,
          pageContext: window.location.pathname,
          starterProgress: buildStarterProgressPayload(),
          mode: user ? "account" : "guest", // ⬅ NEW
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const answer =
        data.answer ||
        "I’m not sure what to say yet, try rephrasing your question.";

      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (err) {
      console.error("API error:", err);
      setError("Network error. Please try again.");
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

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:brightness-105"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-950/40 text-lg">
            💬
          </span>
          <span className="text-xs md:text-sm">Ask the Starter Coach</span>
        </button>
      )}

      {/* Fullscreen modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
          <div className="bg-gray-900 w-full max-w-4xl max-height-[90vh] max-h-[90vh] rounded-3xl border border-gray-700 shadow-[0_24px_80px_rgba(0,0,0,0.75)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-800 px-4 py-3 md:px-6 md:py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-xl">
                  💡
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-100">
                    Side Hustle Starter Coach
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Idea + action plan helper (beta)
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="px-3 py-1 text-xs text-gray-400 hover:text-gray-200 rounded-full bg-gray-800/70 hover:bg-gray-700"
              >
                Close ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col md:flex-row">
              {/* Messages */}
              <div className="flex-1 px-3 py-3 md:px-5 md:py-4 flex flex-col">
                <div className="flex-1 overflow-y-auto rounded-2xl bg-gray-950/40 p-3 space-y-3 max-h-[50vh] md:max-h-[55vh]">
                  {messages.map((msg, i) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={i}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl max-w-[80%] text-xs md:text-sm leading-relaxed ${
                            isUser
                              ? "bg-orange-600 text-white rounded-br-sm whitespace-pre-wrap"
                              : "bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700/60"
                          }`}
                        >
                          {isUser ? (
                            msg.content
                          ) : (
                            <ReactMarkdown
                              components={{
                                a: ({ href, children, ...props }) => {
                                  if (href && href.startsWith("/")) {
                                    // INTERNAL LINK → SPA nav + preserve chat
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
                                      rel="noreferrer"
                                      className="text-orange-400 underline hover:text-orange-300"
                                    >
                                      {children}
                                    </a>
                                  );
                                },
                                p: (props) => (
                                  <p className="mb-2 last:mb-0" {...props} />
                                ),
                                ul: (props) => (
                                  <ul
                                    className="list-disc pl-4 mb-2 space-y-1 last:mb-0"
                                    {...props}
                                  />
                                ),
                                ol: (props) => (
                                  <ol
                                    className="list-decimal pl-4 mb-2 space-y-1 last:mb-0"
                                    {...props}
                                  />
                                ),
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

                {error && (
                  <p className="mt-2 text-[11px] text-red-400">{error}</p>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for help with your idea, a 30-day plan, or what to do next..."
                    className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-xs md:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>

                <p className="mt-2 text-[10px] text-gray-500">
                  Answers are educational only and not financial, legal, or tax advice.
                </p>
              </div>

              {/* Suggested prompts */}
              <div className="border-t border-gray-800 md:border-t-0 md:border-l px-3 py-3 md:px-4 md:py-4 w-full md:w-64 flex flex-col gap-2">
                <p className="text-[11px] font-semibold text-gray-300">
                  Not sure what to ask?
                </p>
                <p className="text-[11px] text-gray-500">
                  Try one of these to get started:
                </p>
                <div className="flex flex-wrap md:flex-col gap-1.5 mt-1">
                  {SUGGESTED_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePromptClick(p)}
                      className="w-full rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-[11px] text-left text-gray-200 hover:border-orange-500/70 hover:text-orange-200"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
