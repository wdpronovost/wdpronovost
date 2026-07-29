# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitor is a hiring manager or recruiter opening the site cold from Billy Pronovost's active job-application materials. Secondary visitors are peers and collaborators assessing his work and working method.

## Product Purpose

`wdpronovost.com` is Billy's public hiring artifact and working portfolio. It must quickly establish who he is, make his strongest software/product work tangible through browser-native demonstrations, explain his human–AI practice without inflated claims, and provide a private way to start a conversation.

Success means a cold visitor can understand Billy's range and judgment, use representative work, trust the factual status of each project, and contact him without encountering private/internal content or exposed personal contact information.

## Positioning

The portfolio does not merely describe projects. It lets visitors use small truthful versions of the work, then exposes the human-in-the-loop method used to shape the site itself through the public Lab.

## Operating Context

- The homepage URL is included in active resume and application materials.
- Visitors commonly arrive on mobile from an application packet and may have only a few minutes.
- The production boundary includes the homepage and every route directly reachable from it.
- The site is a zero-dependency static build: `src/` and selected `public/` assets build to `dist/`, then Netlify deploys `master`.

## Capabilities and Constraints

- Preserve working browser-native demonstrations for selected products and the public Lab.
- Keep all public project status claims grounded in current product sources and live destinations.
- No trackers, remote runtime assets, fabricated metrics, customer claims, pricing, or deployment claims.
- No personal email address, telephone number, or private destination address in public markup or client-side code. Contact is handled by a low-friction host-native form with spam protection.
- The site must work at mobile, tablet, laptop, and wide-desktop sizes; keyboard and reduced-motion support are required.
- Public content must not expose internal handoff language, draft routes, secrets, or PII.

## Brand Commitments

- Name and wordmark: Billy Pronovost / `WDP` (without a dot separator).
- Voice: plainspoken, warm, specific, and human-authored; never vague AI marketing copy.
- The work leads. Visuals should demonstrate function rather than decorate descriptions.
- Never use emoji in site UI, navigation, buttons, status, or visual assets. Use consistent professional SVG iconography only when an icon improves comprehension; otherwise use typography.
- The design must have a distinct point of view and must not resemble a generic AI-generated website template.

## Evidence on Hand

- Real interactive demos and project copy in `src/index.html`, `src/js/site.js`, and project source repositories.
- Public design-method artifact in `public/lab/`.
- Build history generated from repository commits with a committed fallback snapshot.
- Active job-application scope and design history documented in Lumi's Lab.
- No public testimonials, customer logos, or verified outcome metrics are available and none may be invented.

## Product Principles

1. Show working evidence before explanation.
2. Protect privacy by construction, not by disclaimers.
3. Favor a few deep, truthful examples over a broad inventory.
4. Make the human judgment inside AI-assisted work visible.
5. Treat mobile and cold-visitor comprehension as release gates.

## Accessibility & Inclusion

Semantic landmarks, visible keyboard focus, 44px minimum touch targets, accessible form labels and validation, reduced-motion support, no content hidden solely behind motion, and no page-level horizontal overflow.
