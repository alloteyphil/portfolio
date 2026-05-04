# Screenshot Refresh Runbook

## Goal

Refresh project screenshots safely with minimal churn and clear failure handling.

## Use This Document When

- Debugging failed or partial screenshot refresh runs.
- Verifying expected refresh behavior after pipeline changes.
- Operating manual refresh/recovery actions.

## Trigger Paths

- Automatic: push to `main` workflow calls refresh endpoint.
- Manual: admin-triggered refresh action (future admin surface).

## Preconditions

- Featured projects are loaded from Convex.
- Each candidate project has:
  - featured status enabled
  - valid live URL
  - stable repository identifier

## Refresh Logic

1. Load featured live projects from Convex.
2. Compute change fingerprint per project using relevant metadata.
3. If fingerprint unchanged, skip screenshot capture.
4. If changed:
   - capture desktop screenshot via ScreenshotOne
   - upload overwrite to Cloudinary deterministic public ID
   - store updated fingerprint and image metadata
5. On capture/upload failure:
   - keep previous Cloudinary URL
   - record failure metadata for diagnostics

## Failure Policy

- ScreenshotOne quota exceeded: preserve previous image and mark refresh attempt failed.
- Temporary network/provider errors: preserve previous image and allow retry.
- Missing live URL: skip project and surface warning.

## Recovery Steps

1. Validate provider keys and endpoint status.
2. Re-run targeted refresh for failed project IDs.
3. Confirm Cloudinary asset URL remains valid.
4. Confirm projects page still renders old image without breakage.

## Operational Checks

- Ensure no mass-refresh for unchanged projects.
- Verify refresh job output includes processed/skipped/failed counts.
- Verify fallback path retains previous image URL in data store.

## Logging Guidelines

Capture at minimum:

- project identifier
- refresh timestamp
- fingerprint before/after
- action taken (`skipped`, `updated`, `failed_preserved`)
- failure reason when applicable

## Operational Guardrail

- A failed refresh must never remove or invalidate the currently displayed screenshot for a project.
