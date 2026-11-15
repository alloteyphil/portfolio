"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Accra",
  hour: "2-digit",
  minute: "2-digit"
});

/** Local time in Accra with a softly pulsing colon separator when motion is allowed. */
export function AccraClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

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
