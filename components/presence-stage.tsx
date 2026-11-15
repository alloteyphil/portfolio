"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps the hero and gives the visitor their own name flag, trailing the pointer with a little lag,
 * as if they had joined the document. Mouse-only; skipped for touch and reduced motion.
 */
export function PresenceStage({ className = "", children }: { className?: string; children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const flagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const flag = flagRef.current;
    if (!stage || !flag) return;
    if (!document.documentElement.classList.contains("motion-ok")) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let inside = false;

    const step = () => {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      flag.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      const settled = Math.abs(targetX - x) < 0.3 && Math.abs(targetY - y) < 0.3;
      frame = settled ? 0 : requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!inside) {
        inside = true;
        x = targetX;
        y = targetY;
        flag.dataset.on = "";
      }
      if (!frame) frame = requestAnimationFrame(step);
    };

    const onLeave = () => {
      inside = false;
      delete flag.dataset.on;
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={stageRef} className={`relative overflow-x-clip ${className}`.trim()}>
      {children}
      <span ref={flagRef} className="guest-flag" aria-hidden>
        <span>You</span>
      </span>
    </section>
  );
}
