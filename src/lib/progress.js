// src/lib/progress.js

const KEY = "starterPathProgress:v1";

export const STARTER_SLUGS = [
  "choose-your-side-hustle",
  "first-action-plan",
  "budgeting-setup",
  "brand-basics",
  "launch-your-first-page",
];

// --- storage helpers ---
export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

// --- API ---

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
  return STARTER_SLUGS.find((s) => !p[s]) || null;
}

export function percentComplete() {
  const p = loadProgress();
  const total = STARTER_SLUGS.length;
  if (!total) return 0;
  const doneCount = STARTER_SLUGS.filter((s) => p[s]).length;
  return Math.round((doneCount / total) * 100);
}
