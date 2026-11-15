"use client";

import { Monitor, Moon, Sun, iconStroke } from "@/components/icons";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

const MODES = [
  { value: "system" as const, label: "System", Icon: Monitor },
  { value: "light" as const, label: "Light", Icon: Sun },
  { value: "dark" as const, label: "Dark", Icon: Moon }
];

/** Single button that cycles system → light → dark. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const buttonClass =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink/30 hover:text-ink";

  if (!mounted) {
    return <span className={buttonClass} aria-hidden />;
  }

  const index = Math.max(
    0,
    MODES.findIndex((mode) => mode.value === (theme ?? "system"))
  );
  const current = MODES[index];
  const next = MODES[(index + 1) % MODES.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next.value)}
      title={`Theme: ${current.label}`}
      aria-label={`Theme: ${current.label}. Switch to ${next.label}.`}
      className={buttonClass}
    >
      <current.Icon className="size-4" strokeWidth={iconStroke} aria-hidden />
    </button>
  );
}
