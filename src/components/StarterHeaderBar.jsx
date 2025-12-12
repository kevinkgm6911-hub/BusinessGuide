// src/components/StarterHeaderBar.jsx
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

  const isOnStart = pathname === "/start";
  const isOnStarterGuide = slug ? STARTER_SLUGS.includes(slug) : false;

  const [pct, setPct] = useState(percentComplete());
  const [seen, setSeen] = useState(
    () => localStorage.getItem(FLAG) === "true"
  );

  useEffect(() => {
    if ((isOnStart || isOnStarterGuide) && !seen) {
      localStorage.setItem(FLAG, "true");
      setSeen(true);
    }
  }, [isOnStart, isOnStarterGuide, seen]);

  useEffect(() => {
    const update = () => setPct(percentComplete());
    update();
    const off = onProgress(update);
    return off;
  }, []);

  useEffect(() => {
    if (pct >= 100 && seen) {
      localStorage.removeItem(FLAG);
      setSeen(false);
    }
  }, [pct, seen]);

  const shouldShow = (seen || isOnStart || isOnStarterGuide) && pct < 100;
  if (!shouldShow) return null;

  const next = nextIncomplete();

  return (
    <div
      className="
        sticky 
        top-16 md:top-20 
        z-40 
        border-b border-neutral-800 
        bg-gray-900/80 
        backdrop-blur 
        supports-[backdrop-filter]:bg-gray-900/60
      "
    >
      <div
        className="
          mx-auto 
          flex max-w-6xl 
          flex-col gap-2 px-4 py-2 
          sm:flex-row sm:items-center sm:gap-3 sm:px-6
        "
      >
        {/* Label */}
        <span className="text-[11px] font-medium uppercase tracking-wide text-pink-300">
          Starter Path
        </span>

        {/* Progress bar + percent */}
        <div className="flex flex-1 items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-[11px] text-gray-400">
            {pct}%
          </span>
        </div>

        {/* Actions */}
        <div className="mt-1 flex items-center gap-2 sm:mt-0 sm:ml-auto">
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
