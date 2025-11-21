// src/components/GlobalProgressEffects.jsx
import { useEffect, useRef, useState } from "react";
import { onProgress, isComplete } from "../lib/progress";
import PathCompletionToast from "./PathCompletionToast";

export default function GlobalProgressEffects() {
  const [open, setOpen] = useState(false);
  const wasCompleteRef = useRef(isComplete());

  useEffect(() => {
    const check = () => {
      const nowComplete = isComplete();

      // Fire only on transition from not complete -> complete
      if (!wasCompleteRef.current && nowComplete) {
        setOpen(true);
      }

      wasCompleteRef.current = nowComplete;
    };

    // Run once and then subscribe
    check();
    const off = onProgress(check);
    return () => {
      off?.();
    };
  }, []);

  return (
    <PathCompletionToast
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
