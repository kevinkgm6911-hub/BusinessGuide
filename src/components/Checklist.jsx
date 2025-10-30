import { useEffect, useMemo, useState } from "react";

function clsx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Checklist
 * - Controlled locally with persistence via localStorage
 * - Use a unique storageKey per guide (e.g., `checklist:${slug}:budget-setup`)
 * - Items: [{ id: "unique", label: "string", note?: "string" }]
 */
export default function Checklist({
  title = "Checklist",
  items = [],
  storageKey, // e.g., `checklist:budgeting-101:starter`
  className = "",
}) {
  const safeKey = storageKey || `checklist:${title.toLowerCase().replace(/\s+/g, "-")}`;
  const [checked, setChecked] = useState({});

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(safeKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch (_) {}
  }, [safeKey]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(safeKey, JSON.stringify(checked));
    } catch (_) {}
  }, [checked, safeKey]);

  const total = items.length;
  const done = useMemo(
    () => items.reduce((acc, it) => (checked[it.id] ? acc + 1 : acc), 0),
    [items, checked]
  );
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setChecked({});
  }

  return (
    <div
      className={clsx(
        "mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <h4 className="text-lg font-semibold">{title}</h4>
        <span className="ml-auto text-xs text-neutral-400">
          {done}/{total} ({pct}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full rounded-full bg-neutral-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((it) => {
          const isOn = !!checked[it.id];
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => toggle(it.id)}
                className={clsx(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition",
                  isOn
                    ? "border-pink-500/40 bg-pink-500/10"
                    : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                )}
                aria-pressed={isOn}
              >
                <span
                  className={clsx(
                    "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-md border",
                    isOn
                      ? "border-pink-400 bg-pink-500/20"
                      : "border-neutral-700 bg-neutral-900"
                  )}
                  aria-hidden
                >
                  {isOn ? "✓" : ""}
                </span>
                <div className="leading-snug">
                  <div className="text-sm text-neutral-100">{it.label}</div>
                  {it.note && (
                    <div className="mt-0.5 text-xs text-neutral-400">{it.note}</div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
