// PathCompletionToast.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PathCompletionToast({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <div className="w-[22rem] max-w-[90vw] rounded-xl border border-pink-500/30 bg-gray-900/95 p-4 shadow-xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <h3 className="text-lg font-semibold text-white">Starter Path Complete!</h3>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          You’re on your way to launching your business. What’s next?
        </p>

        <div className="grid gap-2">
          <Link to="/community" className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold hover:bg-orange-700 text-white text-center" onClick={onClose}>Join the Community →</Link>
          <Link to="/resources" className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm hover:border-neutral-600 text-center" onClick={onClose}>Explore more guides →</Link>
          <a href="/#newsletter" className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-sm text-pink-200 hover:border-pink-500/50 text-center" onClick={onClose}>Get weekly tips →</a>
        </div>

        <button onClick={onClose} className="mt-3 block w-full text-center text-xs text-gray-400 hover:text-gray-300">Dismiss</button>
      </div>
    </div>
  );
}
