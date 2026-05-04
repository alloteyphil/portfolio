"use client";

import { Monitor, Moon, Sun, iconStroke } from "@/components/icons";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

const MODES = [
  { value: "light" as const, label: "Light", Icon: Sun },
  { value: "dark" as const, label: "Dark", Icon: Moon },
  { value: "system" as const, label: "System", Icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className="h-9 w-[6.75rem] animate-pulse rounded-md border border-terminal-border bg-terminal-panel/50 sm:h-8 sm:w-[6.25rem]"
        aria-hidden
      />
    );
  }

  const current = theme ?? "system";

  return (
    <div className="flex flex-col items-end gap-1 sm:items-start">
      <div
        role="group"
        aria-label="Color theme"
        className="inline-flex items-center gap-0.5 rounded-md border border-terminal-border bg-terminal-bg p-1"
      >
        {MODES.map(({ value, label, Icon }) => {
          const active = current === value;
          return (
            <button
              key={value}
              type="button"
              title={label}
              aria-label={`${label} theme`}
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={`inline-flex h-8 w-9 shrink-0 items-center justify-center rounded border transition sm:h-7 sm:w-8 ${
                active
                  ? "border-terminal-accent bg-terminal-accent/15 text-terminal-accent"
                  : "border-transparent text-terminal-text/65 hover:border-terminal-border/80 hover:bg-terminal-panel/60 hover:text-terminal-text"
              }`}
            >
              <Icon
                className="size-4 sm:size-3.5"
                strokeWidth={iconStroke}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
