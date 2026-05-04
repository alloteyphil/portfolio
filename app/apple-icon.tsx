import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(165deg, #161616 0%, #080808 100%)",
          borderRadius: 36,
          border: "3px solid #2a2a2a",
          padding: 22,
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: "#f87171" }} />
          <div style={{ width: 24, height: 24, borderRadius: 12, background: "#facc15" }} />
          <div style={{ width: 24, height: 24, borderRadius: 12, background: "#4ade80" }} />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginTop: 8
          }}
        >
          <div
            style={{
              color: "#86efac",
              fontSize: 76,
              fontWeight: 700,
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              lineHeight: 1
            }}
          >
            {">"}
          </div>
          <div
            style={{
              width: 52,
              height: 12,
              background: "#86efac",
              borderRadius: 4,
              marginTop: 18
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
