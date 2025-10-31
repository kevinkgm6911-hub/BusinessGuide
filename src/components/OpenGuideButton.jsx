import { useNavigate } from "react-router-dom";

export default function OpenGuideButton({ slug, onBeforeNavigate, className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={className || "inline-block px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-sm font-semibold"}
      onClick={(e) => {
        e.preventDefault();
        // run any progress or analytics before leaving
        try { onBeforeNavigate?.(); } catch {}
        // defer navigation so it never races state updates
        setTimeout(() => navigate(`/resources/${slug}`), 0);
      }}
    >
      Open guide →
    </button>
  );
}
