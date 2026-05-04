import { ImageResponse } from "next/og";

export const alt = "Philip | Portfolio — full-stack dev · Accra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(120% 120% at 0% 0%, #0f1410 0%, #0a0a0a 55%, #050505 100%)",
          padding: 64,
          fontFamily: "ui-monospace, Menlo, Consolas, monospace",
          color: "#d8e4c8",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 32,
            border: "1px solid #2a2a2a",
            borderRadius: 24,
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#86efac",
            fontSize: 26,
            fontWeight: 600
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              border: "1px solid #2a2a2a",
              borderRadius: 8,
              background: "#111111",
              color: "#86efac"
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{">"}</span>
            <span style={{ fontSize: 18, color: "#d8e4c8" }}>~/portfolio</span>
          </div>
          <span style={{ color: "#fbbf24", fontSize: 18 }}>$ ./hello</span>
        </div>

        <div
          style={{
            marginTop: 80,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1
          }}
        >
          <span style={{ color: "#d8e4c8" }}>Philip</span>
          <span style={{ color: "#3a3a3a", fontWeight: 300 }}>|</span>
          <span style={{ color: "#86efac" }}>Portfolio</span>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#c8d4b8",
            lineHeight: 1.3,
            maxWidth: 980
          }}
        >
          full-stack dev · Accra · ships Next.js, React Native, real-time backends.
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#7d8a6f",
            fontSize: 22
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ color: "#86efac" }}>~/projects</span>
            <span style={{ color: "#86efac" }}>~/about</span>
            <span style={{ color: "#86efac" }}>~/contact</span>
          </div>
          <div style={{ color: "#fbbf24" }}>philip-allotey.dev</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
