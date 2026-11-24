"use client";

import { useEffect, useState } from "react";

const LEAD = "Software that";
const DRAFT = "works on my machine.";
const FINAL = "stays up when the room fills up.";

type Phase = "static" | "draft" | "select" | "type" | "done";

/**
 * The homepage headline, edited live: a caret flagged "Philip" selects the draft phrase and retypes it.
 * Uses a single chained timer rather than scheduling dozens of parallel timeouts upfront.
 * Server render, no-JS and reduced-motion all show the finished sentence.
 */
export function LiveHeadline() {
  const [phase, setPhase] = useState<Phase>("static");
  const [text, setText] = useState(FINAL);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-ok")) return;

    const steps: Array<{ delay: number; run: () => void }> = [
      {
        delay: 250,
        run: () => {
          setText(DRAFT);
          setSelected(0);
          setPhase("draft");
        }
      }
    ];

    for (let i = 1; i <= DRAFT.length; i++) {
      steps.push({
        delay: i === 1 ? 1416 : 16,
        run: () => {
          if (i === 1) setPhase("select");
          setSelected(i);
        }
      });
    }

    steps.push({
      delay: 450,
      run: () => {
        setText("");
        setSelected(0);
        setPhase("type");
      }
    });

    for (let i = 1; i <= FINAL.length; i++) {
      const stroke = 28 + ((i * 37) % 5) * 9 + (FINAL[i - 2] === " " ? 30 : 0);
      steps.push({
        delay: i === 1 ? 140 + stroke : stroke,
        run: () => setText(FINAL.slice(0, i))
      });
    }

    steps.push({
      delay: 600,
      run: () => setPhase("done")
    });

    let index = 0;
    let timerId = 0;

    const next = () => {
      if (index >= steps.length) return;
      const step = steps[index]!;
      index += 1;
      timerId = window.setTimeout(() => {
        step.run();
        next();
      }, step.delay);
    };

    next();
    return () => window.clearTimeout(timerId);
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
