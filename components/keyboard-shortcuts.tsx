"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Binding = {
  combo: string;
  description: string;
};

const NAV_BINDINGS: ReadonlyArray<Binding> = [
  { combo: "g h", description: "go home" },
  { combo: "g p", description: "go to projects" },
  { combo: "g a", description: "go to about" },
  { combo: "g c", description: "go to contact" },
  { combo: "g b", description: "go to blog" },
  { combo: "g r", description: "open resume (new tab)" }
];

const UTIL_BINDINGS: ReadonlyArray<Binding> = [
  { combo: "?", description: "toggle this help" },
  { combo: "Esc", description: "close / cancel" }
];

const G_TIMEOUT_MS = 1500;

const NAV_TARGETS: Record<string, { kind: "push" | "open"; href: string }> = {
  h: { kind: "push", href: "/" },
  p: { kind: "push", href: "/projects" },
  a: { kind: "push", href: "/about" },
  c: { kind: "push", href: "/contact" },
  b: { kind: "push", href: "/blog" },
  r: { kind: "open", href: "/resume.pdf" }
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gArmedRef = useRef(false);
  const gTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelGSequence = useCallback(() => {
    gArmedRef.current = false;
    if (gTimerRef.current !== null) {
      clearTimeout(gTimerRef.current);
      gTimerRef.current = null;
    }
  }, []);

  const armGSequence = useCallback(() => {
    gArmedRef.current = true;
    if (gTimerRef.current !== null) clearTimeout(gTimerRef.current);
    gTimerRef.current = setTimeout(() => {
      gArmedRef.current = false;
      gTimerRef.current = null;
    }, G_TIMEOUT_MS);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (helpOpen && !dialog.open) {
      dialog.showModal();
    } else if (!helpOpen && dialog.open) {
      dialog.close();
    }
  }, [helpOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;

      if (event.key === "Escape") {
        if (helpOpen) {
          event.preventDefault();
          closeHelp();
        }
        cancelGSequence();
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen((open) => !open);
        cancelGSequence();
        return;
      }

      if (helpOpen) return;

      if (gArmedRef.current) {
        const target = NAV_TARGETS[event.key.toLowerCase()];
        cancelGSequence();
        if (target) {
          event.preventDefault();
          if (target.kind === "push") {
            router.push(target.href);
          } else {
            window.open(target.href, "_blank", "noopener,noreferrer");
          }
        }
        return;
      }

      if (event.key === "g" || event.key === "G") {
        event.preventDefault();
        armGSequence();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (gTimerRef.current !== null) {
        clearTimeout(gTimerRef.current);
        gTimerRef.current = null;
      }
    };
  }, [armGSequence, cancelGSequence, closeHelp, helpOpen, router]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      closeHelp();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={closeHelp}
      onClick={handleBackdropClick}
      className="m-auto rounded-lg border border-terminal-border bg-terminal-panel/95 p-0 text-terminal-text shadow-terminal backdrop:bg-black/60"
    >
      <div className="min-w-72 max-w-md p-5 sm:min-w-96 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-terminal-amber">$ shortcuts --list</p>
          <button
            type="button"
            onClick={closeHelp}
            aria-label="Close shortcuts help"
            className="rounded-md border border-terminal-border px-2 py-1 text-xs text-terminal-text/80 transition hover:border-terminal-accent hover:text-terminal-accent"
          >
            esc
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          <Section title="navigation" bindings={NAV_BINDINGS} />
          <Section title="general" bindings={UTIL_BINDINGS} />
        </div>

        <p className="mt-5 text-[11px] text-terminal-text/60 sm:text-xs">
          tip: press <Kbd>g</Kbd> then a letter (within 1.5s).
        </p>
      </div>
    </dialog>
  );
}

function Section({
  title,
  bindings
}: {
  title: string;
  bindings: ReadonlyArray<Binding>;
}) {
  return (
    <section>
      <h2 className="text-xs font-medium text-terminal-accent sm:text-sm">{title}</h2>
      <ul className="mt-2 space-y-1.5">
        {bindings.map((binding) => (
          <li key={binding.combo} className="flex items-center justify-between gap-4">
            <span className="text-terminal-text/85">{binding.description}</span>
            <span className="flex items-center gap-1">
              {binding.combo.split(" ").map((token, idx) => (
                <Kbd key={`${binding.combo}-${idx}`}>{token}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[11px] text-terminal-text/90 sm:text-xs">
      {children}
    </kbd>
  );
}
