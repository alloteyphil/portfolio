import { ImageResponse } from "next/og";

export const alt = "Philip Allotey, full-stack developer in Accra: software that stays up when the room fills up.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#6220CD";
const MARIGOLD = "#FFC425";

/** The homepage headline mid-edit: the retyped phrase still carries its selection highlight. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F3FC",
          padding: 72,
          color: INK
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontSize: 98,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1.06
          }}
        >
          <div>Software that</div>
          <div style={{ display: "flex", background: MARIGOLD, padding: "0 14px", marginLeft: -14 }}>
            stays up when the
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", background: MARIGOLD, padding: "0 14px", marginLeft: -14 }}>
              room fills up.
            </div>
            <div style={{ width: 8, height: 96, background: INK, marginLeft: 10 }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 32 }}>
          <div style={{ fontWeight: 800 }}>Philip Allotey</div>
          <div>Full-stack developer in Accra</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
