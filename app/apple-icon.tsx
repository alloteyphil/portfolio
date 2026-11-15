import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark as the favicon: a "P" with the marigold caret, on purple. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          background: "#6D28D9"
        }}
      >
        <div style={{ color: "#FFFFFF", fontSize: 124, fontWeight: 800, lineHeight: 1 }}>P</div>
        <div style={{ width: 18, height: 112, background: "#FFC425" }} />
      </div>
    ),
    { ...size }
  );
}
