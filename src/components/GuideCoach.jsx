import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  p: (props) => <p className="mb-2 leading-relaxed" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
};

const DEFAULT_PROMPTS = [
  {
    id: "brainstorm",
    label: "Generate 10 ideas that fit me",
    prompt:
      "Help me brainstorm 10 side hustle ideas that fit my skills/interests and realistic time. Ask me 3 quick questions first, then generate the ideas.",
  },
  {
    id: "narrow",
    label: "Narrow my list to top 3",
    prompt:
      "I have a few ideas. Help me narrow them to the top 3 based on enjoyment, skill fit, and market demand. Use a simple scoring rubric and explain your reasoning.",
  },
  {
    id: "weekend-test",
    label: "Design a weekend validation test",
    prompt:
      "Help me design a 1-weekend validation test for my idea. Include: who to talk to, what to post, what to offer, and what counts as a good signal.",
  },
  {
    id: "audience",
    label: "Define my target customer",
    prompt:
      "Help me define a specific target customer for my idea. Ask clarifying questions, then produce a clear 'who I help' statement and 3 example customer profiles.",
  },
];

export default function GuideCoach({
  title = "Coach Helper",
  subtitle = "Use this mini-coach to work through this guide with you.",
  guideSlug = "",
  guideTitle = "",
  guideGoal = "",
  seedPrompts = DEFAULT_PROMPTS,
  memorySaveEnabled = true,
}) {
  const { user } = useAuth() || {};
  const location = useLocation();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Tell me what you’ve got so far (even if it’s messy). If you want, tap one of the quick prompts above.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveNote, setSaveNote] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  const pageContext = useMemo(() => {
    return {
      pathname: location.pathname,
      guideSlug,
      guideTitle,
      guideGoal,
      component: "GuideCoach",
    };
  }, [location.pathname, guideSlug, guideTitle, guideGoal]);

  async function sendMessage(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || isLoading) return;

    setSaveNote("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsLoading(true);

    try {
      const res = await fetch("/.netlify/functions/ask-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          pageContext,
          userId: user?.id || null,
          // IMPORTANT: this is how we “pass messages into the function”
          // so it can be multi-turn within THIS embedded helper.
          messages: [
            ...messages,
            { role: "user", content: trimmed },
          ].slice(-12), // keep it light
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("GuideCoach ask-coach error:", t);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry — I hit a server error. Try again in a moment.",
          },
        ]);
        return;
      }

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn’t generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("GuideCoach send exception:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hmm — I couldn’t reach the server. Try again in a bit.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveMemorySnippet() {
    if (!memorySaveEnabled) return;
    if (!user?.id) {
      setSaveNote("Log in to save memory across tools.");
      return;
    }

    // Grab last assistant message as the thing to save (simple + reliable)
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant?.content) return;

    try {
      // If you already have a memory endpoint, use it.
      // If not, this call will fail gracefully and we’ll show a message.
      const res = await fetch("/.netlify/functions/save-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          source: "guide:choose-your-side-hustle",
          snippet: lastAssistant.content,
        }),
      });

      if (!res.ok) {
        setSaveNote("Saving memory isn’t wired up yet (endpoint missing).");
        return;
      }

      setSaveNote("Saved to your profile memory.");
    } catch {
      setSaveNote("Saving memory isn’t wired up yet.");
    }
  }

  return (
    <div className="my-10 rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-500/10 to-transparent p-5">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1">
          <div className="text-xs font-semibold text-pink-200">AI helper</div>
          <h3 className="mt-1 text-xl font-extrabold text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-200">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content:
                    "Tell me what you’ve got so far (even if it’s messy). If you want, tap one of the quick prompts below.",
                },
              ])
            }
            className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs text-gray-200 hover:border-gray-600"
          >
            New chat
          </button>

          <button
            type="button"
            onClick={saveMemorySnippet}
            className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs text-pink-200 hover:border-pink-500/50"
          >
            Save key takeaway
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="mt-4 flex flex-wrap gap-2">
        {seedPrompts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => sendMessage(p.prompt)}
            className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-100 hover:border-orange-500"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="mt-4 max-h-[360px] overflow-y-auto rounded-xl border border-gray-800 bg-gray-900/60 p-3 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm ${
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
          <div className="text-xs text-gray-400">Coach is thinking…</div>
        )}
        {saveNote && <div className="text-xs text-gray-300">{saveNote}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
          setInput("");
        }}
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here… (Example: ‘I like design, I have 5 hours/week, and I want $300/month’) "
          className="max-h-28 flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </form>

      <p className="mt-2 text-xs text-gray-400">
      </p>
    </div>
  );
}
