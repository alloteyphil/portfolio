"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#F6F3FC",
          color: "#2E1065",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px"
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            The site failed to load.
          </h1>
          <p style={{ marginTop: 16, marginBottom: 0, fontSize: 17, lineHeight: 1.6 }}>
            Reload the page to try again.
          </p>
          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 14, color: "#685496" }}>
            {error?.message ?? "Unknown error"}
            {error?.digest ? ` (digest: ${error.digest})` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              minHeight: 48,
              padding: "0 22px",
              border: 0,
              borderRadius: 6,
              background: "#6D28D9",
              color: "#FFFFFF",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Reload the page
          </button>
        </div>
      </body>
    </html>
  );
}
