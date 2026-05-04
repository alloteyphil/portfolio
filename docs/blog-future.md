# Blog Deferred Plan

## Current Status

- Blog is intentionally excluded from shipped V2 scope.
- `/blog` route should not be linked in primary navigation for this phase.
- No publishing workflow is active in production.

## Use This Document When

- Reconsidering blog scope for a future phase.
- Planning blog activation work without impacting shipped V2 scope.

## Why Deferred

- Current priority is portfolio curation, screenshot reliability, contact flow, and analytics baseline.
- Deferring blog avoids scope spill while preserving a documented activation path.

## Planned Future Blog Direction

- Content format: MDX.
- Content source: repository-managed files or CMS (to be decided).
- Route structure target:
  - `/blog`
  - `/blog/[slug]`
- Metadata target:
  - title/description per post
  - canonical URL
  - OG image support

## Activation Checklist

1. Confirm content source (file-based MDX vs CMS).
2. Add route tree for listing and post pages.
3. Add content loader and frontmatter schema validation.
4. Add RSS (optional) and sitemap integration.
5. Re-enable blog navigation link.
6. Add analytics events for post views and outbound links.
7. Add tests for slug parsing and metadata generation.

## Non-Goals for V2

- Editorial workflow tooling.
- Search indexing for posts.
- Multi-author features.

## Scope Guardrail

- Blog implementation work should not block portfolio core reliability milestones.
