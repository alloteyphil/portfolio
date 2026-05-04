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
          background: "#0a0a0a",
          color: "#d8e4c8",
          fontFamily: "ui-monospace, Menlo, Consolas, monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px"
        }}
      >
        <div
          style={{
            maxWidth: 560,
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: 24,
            background: "#111111"
          }}
        >
          <p style={{ color: "#86efac", margin: 0 }}>$ trap --fatal</p>
          <p style={{ color: "#fbbf24", marginTop: 12, marginBottom: 0 }}>
            something failed at the root layout.
          </p>
          <p style={{ marginTop: 16, marginBottom: 0, fontSize: 14, color: "#c8d4b8" }}>
            {error?.message ?? "unknown error"}
            {error?.digest ? ` (digest: ${error.digest})` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 16px",
              border: "1px solid #86efac",
              borderRadius: 6,
              background: "transparent",
              color: "#86efac",
              fontFamily: "inherit",
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            reload
          </button>
        </div>
      </body>
    </html>
  );
}
