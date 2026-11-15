import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** A "P" with the marigold caret beside it, on purple. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          background: "#6D28D9",
          borderRadius: 6
        }}
      >
        <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>P</div>
        <div style={{ width: 4, height: 20, background: "#FFC425" }} />
      </div>
    ),
    { ...size }
  );
}
