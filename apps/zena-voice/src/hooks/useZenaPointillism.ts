import { useEffect, useRef, useState } from "react";

type Result = {
  ref: React.RefObject<HTMLElement>;
  reveal: number; // 0 = fully revealed (sharp), 1 = fully dotted
  tiltX: number; // -1..1
  tiltY: number; // -1..1
  isInteracting: boolean;
};

export default function useZenaPointillism<T extends HTMLElement = HTMLDivElement>(maxDistance = 360): Result & { ref: React.RefObject<T> } {
  const ref = useRef<HTMLElement | null>(null);
  const [reveal, setReveal] = useState(1);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      const clamped = Math.min(dist / maxDistance, 1);
      // reveal: 0 (sharp) when close, 1 (dotted) when far
      setReveal(clamped);

      // tilt normalized
      const tx = Math.max(Math.min(dx / (rect.width / 2), 1), -1);
      const ty = Math.max(Math.min(dy / (rect.height / 2), 1), -1);
      setTiltX(tx);
      setTiltY(ty);

      setIsInteracting(dist < maxDistance);
    }

    function onPointerLeave() {
      setReveal(1);
      setTiltX(0);
      setTiltY(0);
      setIsInteracting(false);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [maxDistance]);

  // touch support: press & hold to reveal
  useEffect(() => {
    let touchTimeout: number | null = null;

    function onTouchStart(e: TouchEvent) {
      if (!ref.current) return;
      touchTimeout = window.setTimeout(() => {
        // center touch
        const t = e.touches[0];
        const rect = ref.current!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = t.clientX - cx;
        const dy = t.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const clamped = Math.min(dist / maxDistance, 1);
        setReveal(clamped);
        setIsInteracting(true);
      }, 150);
    }

    function onTouchEnd() {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
        touchTimeout = null;
      }
      setReveal(1);
      setIsInteracting(false);
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("touchend", onTouchEnd as EventListener);
      if (touchTimeout) clearTimeout(touchTimeout);
    };
  }, [maxDistance]);

  return { ref, reveal, tiltX, tiltY, isInteracting };
}
