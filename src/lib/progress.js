// src/lib/progress.js

const KEY = "starterPathProgress:v1";

export const STARTER_SLUGS = [
  "choose-your-side-hustle",
  "first-action-plan",
  "budgeting-setup",
  "brand-basics",
  "launch-your-first-page",
];

// --- storage helpers
export function loadProgress() {
  try {
    if (typeof localStorage === "undefined") return {};
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(p) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(p));
    // notify all listeners (same tab)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("progress:update"));
    }
  } catch {
    // ignore
  }
}

// --- basic api
export function isDone(slug) {
  const p = loadProgress();
  return !!p[slug];
}

export function setDone(slug, value = true) {
  const p = loadProgress();
  p[slug] = !!value;
  saveProgress(p);
}

export function resetProgress() {
  saveProgress({});
}

export function nextIncomplete() {
  const p = loadProgress();
  return STARTER_SLUGS.find((s) => !p[s]);
}

export function percentComplete() {
  const p = loadProgress();
  const done = STARTER_SLUGS.filter((s) => p[s]).length;
  if (STARTER_SLUGS.length === 0) return 0;
  return Math.round((done / STARTER_SLUGS.length) * 100);
}

// --- subscribe helper for React components
export function onProgress(handler) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const cb = () => handler();
  window.addEventListener("progress:update", cb);

  // cross-tab updates via native 'storage'
  const storageCb = (e) => {
    if (e.key === KEY) handler();
  };
  window.addEventListener("storage", storageCb);

  return () => {
    window.removeEventListener("progress:update", cb);
    window.removeEventListener("storage", storageCb);
  };
}

// --- completion helpers
export function isComplete() {
  return percentComplete() >= 100;
}

export const COMPLETE_SEEN_FLAG = "starterPathCompleteSeen:v1";
