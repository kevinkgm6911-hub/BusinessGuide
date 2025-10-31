import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PathCompletionModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    // simple confetti using emojis (no extra deps)
    const id = setInterval(() => {
      const e = document.createElement("div");
      e.textContent = Math.random() > 0.5 ? "🎉" : "✨";
      e.style.position = "fixed";
      e.style.left = Math.random() * 100 + "vw";
      e.style.top = "-10px";
      e.style.fontSize = "24px";
      e.style.zIndex = "999999";
      e.style.pointerEvents = "none";
      e.style.transition = "transform 2.2s linear, opacity 2.2s linear";
      document.body.appendChild(e);
      requestAnimationFrame(() => {
        e.style.transform = `translateY(${window.innerHeight + 60}px) rotate(${(Math.random()*360)|0}deg)`;
        e.style.opacity = "0.2";
      });
      setTimeout(() => e.remove(), 2300);
    }, 120);
    setTimeout(() => clearInterval(id), 1600);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-pink-500/30 bg-gray-900 p-6 shadow-xl">
        <div className="mb-3 text-center">
          <div className="text-4xl">🎉</div>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Starter Path Complete!
          </h2>
          <p className="mt-2 text-gray-300">
            You’re officially on your way to launching your business. Nice work.
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <Link
            to="/community"
            className="rounded-lg bg-orange-600 px-4 py-2 text-center font-semibold hover:bg-orange-700"
            onClick={onClose}
          >
            Join the Community →
          </Link>
          <Link
            to="/resources"
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-center hover:border-neutral-600"
            onClick={onClose}
          >
            Explore more guides →
          </Link>
          <a
            href="/#newsletter"
            className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-center text-pink-200 hover:border-pink-500/50"
            onClick={onClose}
          >
            Get weekly tips (email) →
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-5 block w-full text-center text-sm text-gray-400 hover:text-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
