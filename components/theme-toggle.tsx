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

type ThemeToggleProps = {
  /** Called after choosing a theme (e.g. close parent drawer). */
  onThemeSelected?: () => void;
};

export function ThemeToggle({ onThemeSelected }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className="h-10 w-[7.25rem] animate-pulse rounded-lg border border-terminal-border bg-terminal-panel/50 md:h-11 md:w-[8rem]"
        aria-hidden
      />
    );
  }

  const current = theme ?? "system";

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 rounded-lg border border-terminal-border bg-terminal-bg p-1"
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
              onClick={() => {
                setTheme(value);
                onThemeSelected?.();
              }}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition md:h-9 md:w-9 ${
                active
                  ? "border-terminal-accent bg-terminal-accent/12 text-terminal-accent shadow-[inset_0_0_0_1px_rgb(var(--color-terminal-accent)/0.15)]"
                  : "border-transparent text-terminal-text/65 hover:border-terminal-border/80 hover:bg-terminal-panel/70 hover:text-terminal-text"
              }`}
            >
              <Icon
                className="size-4 md:size-[1.05rem]"
                strokeWidth={iconStroke}
                aria-hidden
              />
            </button>
          );
        })}
    </div>
  );
}
