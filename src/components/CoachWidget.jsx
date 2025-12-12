// src/components/CoachWidget.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import {
  STARTER_SLUGS,
  percentComplete,
  nextIncomplete,
  isDone,
} from "../lib/progress";

const INITIAL_ASSISTANT_MESSAGE = {
  role: "assistant",
  content:
    "Hey, I’m the Side Hustle Starter Coach. Tell me where you’re at: do you already have an idea, or are you still figuring out what kind of side hustle fits you?",
};

// markdown renderers (so links work with React Router)
const markdownComponents = {
  a: ({ href, children, ...props }) => {
    if (!href) return <span {...props}>{children}</span>;
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link to={href} {...props} className="text-orange-400 hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        {...props}
        className="text-orange-400 hover:underline"
      >
        {children}
      </a>
    );
  },
  p: (props) => <p className="mb-1 leading-relaxed" {...props} />,
  li: (props) => <li className="mb-0.5" {...props} />,
};

export default function CoachWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_ASSISTANT_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth() || {};

  // Starter path context
  const starterProgress = useMemo(() => {
    try {
      const percent = percentComplete();
      const doneSlugs = STARTER_SLUGS.filter((slug) => isDone(slug));
      const nextSlug = nextIncomplete();
      return { percent, doneSlugs, nextSlug };
    } catch {
      return null;
    }
  }, []);

  // Auto-scroll when messages / loading change
  useEffect(() => {
    if (!isOpen) return;
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, isLoading, isOpen]);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleNewChat() {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setInput("");
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsLoading(true);

    try {
      const body = {
        message: trimmed,
        pageContext: location.pathname,
        starterProgress,
        userId: user?.id || null,
      };

      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("ask-coach error", await res.text());
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, something went wrong on my side. Try again in a moment.",
          },
        ]);
      } else {
        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn’t generate a response.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      console.error("ask-coach exception", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hmm, I hit an error talking to the server. Please try again in a bit.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend(e) {
    e?.preventDefault();
    const text = input;
    setInput("");
    await sendMessage(text);
  }

  function handleQuickPrompt(text) {
    // Immediately start a new thread from this prompt
    sendMessage(text);
  }

  const isFreshChat =
    messages.length === 1 && messages[0].role === "assistant";

  return (
    <>
      {/* Floating open button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm md:text-base font-semibold text-white shadow-lg shadow-orange-500/40 hover:opacity-95"
        >
          💬 Ask the Coach
        </button>
      )}

      {/* Overlay panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/40 px-2 pb-2 pt-10 md:px-4 md:pb-4">
          <div className="flex h-[78vh] md:h-[80vh] w-full max-w-3xl flex-col rounded-t-2xl md:rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-white">
                  Side Hustle Coach
                </span>
                <span className="text-[11px] md:text-xs text-gray-400">
                  Ask about your idea, next steps, or which guide to use.
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="rounded-full border border-gray-600 px-3 py-1 text-[11px] md:text-xs text-gray-200 hover:border-orange-500 hover:text-white"
                >
                  New chat
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-gray-600 px-2 py-1 text-[11px] md:text-xs text-gray-300 hover:border-gray-400"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3">
              {/* Quick-start prompts (only show at the very start) */}
              {isFreshChat && (
                <div className="mb-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickPrompt(
                        "I want help picking a side hustle that fits my skills, interests, and limited time each week. Ask me questions and help me narrow it down."
                      )
                    }
                    className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-[11px] md:text-xs text-gray-100 hover:border-orange-500"
                  >
                    Help me pick a side hustle
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickPrompt(
                        "I have an idea and I want a simple 30-day action plan to get my first version live. Ask about my idea, my time per week, and my comfort with tech."
                      )
                    }
                    className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-[11px] md:text-xs text-gray-100 hover:border-orange-500"
                  >
                    Turn my idea into a 30-day plan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickPrompt(
                        "Help me understand how to think about pricing and basic money stuff for my side hustle. Ask about my costs, my time, and what feels realistic."
                      )
                    }
                    className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-[11px] md:text-xs text-gray-100 hover:border-orange-500"
                  >
                    Help me with money & pricing
                  </button>
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs sm:text-sm ${
                      m.role === "user"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    <ReactMarkdown components={markdownComponents}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-[11px] sm:text-xs text-gray-400">
                  Coach is thinking…
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-gray-800 px-2 sm:px-3 py-2.5 sm:py-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your idea, next steps, or a specific problem…"
                  className="max-h-32 flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-100 outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl bg-orange-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
