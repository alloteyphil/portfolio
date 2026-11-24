"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Accra",
  hour: "2-digit",
  minute: "2-digit"
});

let currentTime = "";
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function readTime(): string {
  return formatter.format(new Date());
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    currentTime = readTime();
    intervalId = setInterval(() => {
      const next = readTime();
      if (next !== currentTime) {
        currentTime = next;
        for (const fn of listeners) fn();
      }
    }, 15_000);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot(): string {
  if (!currentTime) currentTime = readTime();
  return currentTime;
}

function getServerSnapshot(): string | null {
  return null;
}

/**
 * Local time in Accra with a softly pulsing colon separator.
 * All instances on the page share a single 15s timer via `useSyncExternalStore`.
 */
export function AccraClock({ className = "" }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!time) {
    return (
      <time className={`tabular-nums ${className}`.trim()} suppressHydrationWarning>
        --:--
      </time>
    );
  }

  const [hours, minutes] = time.split(":");

  return (
    <time dateTime={time} className={`tabular-nums ${className}`.trim()} suppressHydrationWarning>
      {hours}
      <span className="clock-colon">:</span>
      {minutes}
    </time>
  );
}
