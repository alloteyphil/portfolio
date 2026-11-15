"use client";

import { useEffect, useRef, type ReactNode } from "react";

type CardTiltProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Subtle 3D perspective tilt + cursor spotlight sheen on screenshot frames.
 * Enabled only on fine-pointer hover devices when motion is allowed; inert on touch and reduced motion.
 */
export function CardTilt({ className = "", children }: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!document.documentElement.classList.contains("motion-ok")) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let rx = 0;
    let ry = 0;
    let trx = 0;
    let tryAngle = 0;
    let active = false;

    const tick = () => {
      rx += (trx - rx) * 0.18;
      ry += (tryAngle - ry) * 0.18;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      const settled = Math.abs(trx - rx) < 0.04 && Math.abs(tryAngle - ry) < 0.04;
      if (settled) {
        raf = 0;
        if (!active) el.style.transform = "";
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      trx = (0.5 - py) * 5.5;
      tryAngle = (px - 0.5) * 6.5;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      if (!active) {
        active = true;
        el.dataset.tilting = "";
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      active = false;
      trx = 0;
      tryAngle = 0;
      delete el.dataset.tilting;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt-frame ${className}`.trim()}>
      {children}
      <span className="tilt-sheen" aria-hidden />
    </div>
  );
}
