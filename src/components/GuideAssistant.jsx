// src/components/GuideAssistant.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

const mdComponents = {
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

/**
 * GuideAssistant
 * Props:
 *  - guideSlug: string (e.g. "choose-your-side-hustle")
 *  - title: string (UI label)
 *  - promptHint: string (short explanation under the title)
 *  - systemHint: string (extra hint to the backend prompt about what this assistant should focus on)
 */
export default function GuideAssistant({
  guideSlug,
  title = "Guide Assistant",
  promptHint = "Use this space to work through this guide step-by-step.",
  systemHint,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Let’s work through this guide together. Tell me where you’re stuck or what you want to decide.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth() || {};

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, isLoading]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsLoading(true);

    try {
      const body = {
        message: trimmed,
        pageContext: location.pathname,
        userId: user?.id || null,
        mode: "guide-assistant",
        guideSlug,
        systemHint,
      };

      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("guide-assistant ask-coach error", await res.text());
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Something went wrong on my side. Try again in a moment or refresh the page.",
          },
        ]);
      } else {
        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn’t generate a response.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      console.error("guide-assistant exception", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I hit an error talking to the server. Please try again in a bit.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input;
    setInput("");
    send(text);
  }

  return (
    <div className="mt-8 rounded-2xl border border-gray-700 bg-gray-900/80 p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white sm:text-base">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            {promptHint}
          </p>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
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
              <ReactMarkdown components={mdComponents}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-[11px] sm:text-xs text-gray-400">
            Thinking with you…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your idea, constraints, or questions…"
            className="max-h-24 flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-100 outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-orange-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
