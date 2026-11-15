"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Accra",
  hour: "2-digit",
  minute: "2-digit"
});

/** Local time in Accra. Renders a fixed-width placeholder on the server to avoid a hydration mismatch. */
export function AccraClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className={`tabular-nums ${className}`.trim()} suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
