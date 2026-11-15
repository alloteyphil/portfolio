"use client";

import { useEffect, useState } from "react";

const LEAD = "Software that";
const DRAFT = "works on my machine.";
const FINAL = "stays up when the room fills up.";

type Phase = "static" | "draft" | "select" | "type" | "done";

/**
 * The homepage headline, edited live: a caret flagged "Philip" selects the draft phrase and retypes it.
 * Server render, no-JS and reduced-motion all show the finished sentence; an invisible copy of it
 * reserves the final height so nothing below shifts while the phrase is being typed.
 */
export function LiveHeadline() {
  const [phase, setPhase] = useState<Phase>("static");
  const [text, setText] = useState(FINAL);
  /** Number of characters selected, counted back from the end of `text`. */
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-ok")) return;

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    let t = 250;
    at(t, () => {
      setText(DRAFT);
      setSelected(0);
      setPhase("draft");
    });

    t += 1400;
    for (let i = 1; i <= DRAFT.length; i++) {
      at(t + i * 16, () => {
        setPhase("select");
        setSelected(i);
      });
    }

    t += DRAFT.length * 16 + 450;
    at(t, () => {
      setText("");
      setSelected(0);
      setPhase("type");
    });

    t += 140;
    for (let i = 1; i <= FINAL.length; i++) {
      // Uneven keystrokes, with a beat after each word.
      t += 28 + ((i * 37) % 5) * 9 + (FINAL[i - 2] === " " ? 30 : 0);
      at(t, () => setText(FINAL.slice(0, i)));
    }

    at(t + 600, () => setPhase("done"));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const head = text.slice(0, text.length - selected);
  const tail = text.slice(text.length - selected);
  const caret = (
    <span className="caret">
      <span className="caret-flag">Philip</span>
    </span>
  );

  return (
    <h1 className="display hero-title text-heading" data-phase={phase}>
      <span className="sr-only">
        {LEAD} {FINAL}
      </span>
      <span className="invisible" aria-hidden>
        {LEAD} {FINAL}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {LEAD}{" "}
        <span className="live-phrase">
          {head}
          {selected > 0 ? (
            <>
              {caret}
              <span className="sel">{tail}</span>
            </>
          ) : (
            caret
          )}
        </span>
      </span>
    </h1>
  );
}
