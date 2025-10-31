import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  STARTER_SLUGS,
  percentComplete,
  nextIncomplete,
  onProgress,
} from "../lib/progress";

const FLAG = "starterBarSeen:v1";

function useCurrentSlug() {
  const { pathname } = useLocation();
  const m = pathname.match(/^\/resources\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function StarterHeaderBar() {
  const { pathname } = useLocation();
  const slug = useCurrentSlug();

  // Detect whether we're currently on the Start page or a Starter guide
  const isOnStart = pathname === "/start";
  const isOnStarterGuide = slug ? STARTER_SLUGS.includes(slug) : false;

  // Should the bar be visible at all?
  const [pct, setPct] = useState(percentComplete());
  const [seen, setSeen] = useState(
    () => localStorage.getItem(FLAG) === "true"
  );

  // Mark as "seen" the first time user touches the path
  useEffect(() => {
    if ((isOnStart || isOnStarterGuide) && !seen) {
      localStorage.setItem(FLAG, "true");
      setSeen(true);
    }
  }, [isOnStart, isOnStarterGuide, seen]);

  // Keep progress fresh & auto-hide at 100%
  useEffect(() => {
    const update = () => setPct(percentComplete());
    update();
    const off = onProgress(update);
    return off;
  }, []);

  // Auto-hide if complete
  useEffect(() => {
    if (pct >= 100 && seen) {
      localStorage.removeItem(FLAG);
      setSeen(false);
    }
  }, [pct, seen]);

  // Render conditions:
  // - Only show if user has seen the path at least once (or currently viewing it)
  // - And if not complete
  const shouldShow = (seen || isOnStart || isOnStarterGuide) && pct < 100;
  if (!shouldShow) return null;

  const next = nextIncomplete();

  return (
    <div className="border-b border-neutral-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-2">
        <span className="whitespace-nowrap text-xs text-pink-300">
          Starter Path
        </span>

        <div className="h-2 w-44 flex-1 max-w-xs overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <span className="text-xs text-gray-400">{pct}%</span>

        <div className="ml-auto flex items-center gap-2">
          {next ? (
            <Link
              to={`/resources/${next}`}
              className="rounded-md bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-orange-700"
            >
              Continue →
            </Link>
          ) : (
            <Link
              to="/start"
              className="rounded-md border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-[11px] text-neutral-300 hover:border-neutral-600"
            >
              View path
            </Link>
          )}

          {/* Optional: manual hide until they revisit the path */}
          <button
            onClick={() => {
              localStorage.removeItem(FLAG);
              setSeen(false);
            }}
            className="rounded-md border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-[11px] text-neutral-300 hover:border-neutral-600"
            title="Hide until you visit the Starter Path again"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
