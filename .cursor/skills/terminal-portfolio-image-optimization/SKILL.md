---
name: terminal-portfolio-image-optimization
description: Applies dual screenshot optimization using Cloudinary delivery transforms and Next.js next/image rendering. Use when changing screenshot transforms, card image rendering, or image performance behavior on projects pages.
---

# Terminal Portfolio Image Optimization

## Use This Skill When

- Updating Cloudinary transform policy for screenshot delivery.
- Updating `next/image` usage in project cards.
- Investigating screenshot performance or layout-shift regressions.

## Optimization Model

- Cloudinary handles format/quality/DPR/crop-size optimization at delivery time.
- Next.js `next/image` handles responsive browser-facing optimization.
- Public IDs remain deterministic and stable for refresh compatibility.

## Primary Touchpoints

- `lib/screenshot-store.ts`
- `lib/cloudinary.ts`
- `components/project-card.tsx`
- `next.config.ts`

## Guardrails

- Keep screenshot aspect ratio stable for card layout consistency.
- Preserve fallback UI when `screenshotUrl` is missing.
- Keep screenshot pipeline/provider logic out of route components.
- Keep Cloudinary host compatibility in Next image config.

## Verification

1. Run `bun run lint` and `bun run build`.
2. Confirm `/projects` renders without layout-shift regressions.
3. Confirm missing screenshots still render pending fallback UI.
