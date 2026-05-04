# Image Optimization

Project screenshots are optimized through two complementary layers.

## Use This Document When

- Updating screenshot transform logic.
- Adjusting project-card image rendering behavior.
- Debugging screenshot quality, payload size, or layout stability.

## Optimization Layers

1. **Cloudinary delivery optimization**
   - Applied in `lib/screenshot-store.ts` delivery URLs.
   - Uses transform defaults for efficient delivery:
     - `f_auto`
     - `q_auto`
     - `dpr_auto`
     - `c_fill`
     - `g_auto`
     - `w_1200`
     - `h_600`
2. **Next.js render optimization**
   - Applied in `components/project-card.tsx` with `next/image`.
   - Keeps card dimensions stable while allowing responsive image behavior.

## Why Both Layers Exist

- Cloudinary reduces bytes and picks modern formats at CDN edge.
- Next.js improves browser-facing loading behavior and responsive image serving.
- Together they improve perceived load and consistency for project cards.

## Guardrails

- Keep deterministic screenshot IDs unchanged.
- Preserve fallback UI when screenshot URLs are missing.
- Keep Cloudinary domains/config compatible with `next.config.ts`.
- Keep screenshot logic in `lib/*`, not route component bodies.

## Validation Checklist

- `bun run lint` passes.
- `bun run build` passes.
- `/projects` renders screenshot cards without visual jump.
- Screenshot fallback still appears when no screenshot is available.
- Delivered screenshot URLs include expected Cloudinary transforms.
