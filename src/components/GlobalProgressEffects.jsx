import { useEffect, useRef, useState } from "react";
import { onProgress, isComplete } from "../lib/progress";
import PathCompletionToast from "./PathCompletionToast";

const TOAST_UNTIL_KEY = "starterPathToastUntil:v1";
const DURATION_MS = 6000;

function now() {
  return Date.now();
}

export default function GlobalProgressEffects() {
  const [open, setOpen] = useState(false);
  const wasCompleteRef = useRef(isComplete());
  const closeTimerRef = useRef(null);
  const tickRef = useRef(null);

  // Helper: open toast until a specific timestamp
  const openUntil = (expiresAt) => {
    // Persist so it survives route changes and remounts
    sessionStorage.setItem(TOAST_UNTIL_KEY, String(expiresAt));
    setOpen(true);

    // Clear existing timer, set new one
    clearTimeout(closeTimerRef.current);
    const remaining = Math.max(0, expiresAt - now());
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      sessionStorage.removeItem(TOAST_UNTIL_KEY);
    }, remaining);
  };

  // On mount: if a previous completion just happened, restore toast
  useEffect(() => {
    const expiresRaw = sessionStorage.getItem(TOAST_UNTIL_KEY);
    const expiresAt = expiresRaw ? Number(expiresRaw) : 0;
    if (expiresAt > now()) {
      openUntil(expiresAt);
    }
  }, []);

  // Listen for percent changes and fire when transitioning to 100%
  useEffect(() => {
    const check = () => {
      const completeNow = isComplete();
      if (!wasCompleteRef.current && completeNow) {
        // Defer to avoid racing with any immediate state updates
        clearTimeout(tickRef.current);
        tickRef.current = setTimeout(() => {
          openUntil(now() + DURATION_MS);
        }, 0);
      }
      wasCompleteRef.current = completeNow;
    };

    // initial + subscribe
    check();
    const off = onProgress(check);
    return () => {
      off?.();
      clearTimeout(tickRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <PathCompletionToast
      open={open}
      onClose={() => {
        setOpen(false);
        sessionStorage.removeItem(TOAST_UNTIL_KEY);
        clearTimeout(closeTimerRef.current);
      }}
    />
  );
}
