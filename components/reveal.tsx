"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  /** `sel` sweeps a selection highlight across a child `.mark`; `up` is a plain rise for lists and cards. */
  kind?: "sel" | "up";
  as?: "div" | "h2" | "li" | "section" | "p";
  /** Stagger step (multiplied in CSS). */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Marks its element `data-in` the first time it scrolls into view; globals.css does the rest.
 * Content is fully visible without JS or with reduced motion (styles are gated on `html.motion-ok`).
 */
export function Reveal({ kind = "up", as = "div", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.in = "";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.in = "";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={kind}
      style={delay ? ({ "--d": delay } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
