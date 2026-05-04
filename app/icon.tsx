import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "linear-gradient(155deg, #151515 0%, #0a0a0a 100%)",
          borderRadius: 7,
          border: "1px solid #2a2a2a"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3
          }}
        >
          <div
            style={{
              color: "#86efac",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              lineHeight: 1,
              marginTop: -2
            }}
          >
            {">"}
          </div>
          <div
            style={{
              width: 9,
              height: 3,
              background: "#86efac",
              borderRadius: 2
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
