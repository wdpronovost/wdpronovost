# wdpronovost.com UX/UI Audit

Date: 2026-07-28
Scope: production homepage and every homepage-reachable route, mobile first
Primary viewport: 390×844; additional checks at 768×1024, 1440×900, and 1920×1080

## Verdict

The site is truthful and unusually interactive, but its visual grammar is now the biggest credibility risk. It presents strong work through a recognizable AI-generated portfolio template: warm cream, oversized editorial serif, tracked micro-labels, rounded nested cards, pill metadata, hard shadows, and a long repeated tile waterfall. The demonstrations are the differentiator; the surrounding chrome makes them look less authored than they are.

Do not polish the current shell. Replace it while preserving the verified content, working interactions, and project truth.

## Highest-priority findings

### 1. Mobile navigation is structurally wrong

The sticky horizontal section navigation requires sideways discovery, exposes clipped labels, and gives the contact action visual parity with every section. On a 390px screen it consumes attention without giving reliable wayfinding. Replace it with a compact wordmark plus a real menu/index; keep one contact path.

### 2. The page is a wall of equal containers

Projects, demonstrations, metadata, build-log entries, statuses, and supporting explanations repeatedly become bordered cards, inner cards, chips, and pills. The visual density is high but the information hierarchy is flat. The visitor must process every project at nearly the same intensity.

Use a sparse primary route with one or two works at room scale, then move the rest into a compact project index. Vary density deliberately rather than spacing every block the same way.

### 3. Typography is expressive but not disciplined

The current serif display, italic emphasis, uppercase micro-labels, and extreme negative tracking create a recognizable “AI editorial” register. On mobile, functional labels fall as low as 8–10px. Several display lines collide or feel clipped rather than intentionally typeset.

Use one engineered sans family with a deliberate condensed/display role. Functional text must be at least 12px, body text at least 16px, and display tracking must stay readable on small screens.

### 4. Emoji-like Unicode is functioning as iconography

The up-right arrow renders as a blue emoji tile on iOS. Additional star, check, double-arrow, and directional glyphs appear in public markup and CSS. They do not belong in a professional icon system and can change appearance by platform.

Remove emoji and emoji-presenting Unicode from UI. Use a small local SVG icon set with consistent stroke, geometry, and sizing only where icons add comprehension.

### 5. The visual system has too many simultaneous motifs

Warm paper, terracotta, teal, plum, heavy borders, hard shadows, soft shadows, circles, pills, rounded cards, editorial serif, technical labels, and decorative diagrams compete for authorship. The page feels assembled from individually styled sections rather than directed as one system.

Commit to one material logic, one accent strategy, one border philosophy, one type system, and one spacing scale.

### 6. The contact path is not production-ready

The new local form markup is not yet matched by CSS, success-state JavaScript, Netlify CSP, form validation tests, or a production privacy scan. Production still exposes direct email links on the homepage and public direction routes. The current CSP blocks forms with `form-action 'none'`.

Complete the host-native form, use a honeypot, switch CSP to same-origin form submission, add success/failure feedback, and remove private email and `mailto:` from every built public route.

### 7. Public legacy direction routes expand the privacy and quality surface

`public/directions/` pages are deployed, contain direct email links, and use Unicode arrow/star motifs. If they remain public they must meet the same privacy and iconography standard; otherwise remove them from the deployed build.

## Impeccable.style findings

Impeccable 4.0.2 was installed and its detector was run against both source and the live 390×844 page.

Source scan:
- 19 em dashes in body copy
- 3 side-tab border patterns
- 1 layout-transition performance issue

Live scan:
- 183 total findings
- 74 undersized functional-text findings
- 47 low-contrast findings
- 30 wide-tracking findings
- 18 tiny-body-text findings
- 4 cramped-padding findings
- 4 extreme-negative-tracking findings
- additional gray-on-color, kicker-above-heading, dark-glow, and cream-palette signals

The detector is a floor, not a taste engine. Its findings confirm the visual audit; the redesign still needs a point of view beyond clearing rules.

## What remains worth preserving

- Browser-native demonstrations rather than screenshots.
- The “human decides” Lab concept and its working persistence/reset behavior.
- Accurate project status and product truth.
- The identity-mode interaction, rebuilt in a cleaner grammar.
- The generated build history, presented as a compact record rather than another card module.
- Plainspoken copy and a clear hiring-manager path.

## Direction studies

### Signal Ledger

Grounding: IBM Carbon’s strict grid and flat hierarchy, softened by Notion-level restraint.

A calm operating surface: near-white canvas, graphite, cobalt, crisp rules, condensed display type, one interactive evidence rail, one featured project, and a compact indexed archive. It is the strongest balance of professional credibility, technical character, and mobile clarity.

Risk: without careful authored diagrams it can drift toward a generic enterprise design-system demo.

### Open Archive

Grounding: Notion’s warm restraint and Impeccable’s open-storage staging.

One project is displayed at room scale; the rest sit in a dense pull-forward archive. This best solves the tile bunching and creates a calm reading experience.

Risk: cream plus large condensed type can still feel like the safer “tasteful portfolio” template if the project interactions are too quiet.

### Dispatch Manual

Grounding: Sanity’s engineered editorial energy and an operations-record metaphor.

A bold black, orange, and signal-lime system organized around “Build it. Test it. Show the trace.” It has the strongest identity and least resemblance to the current shell.

Risk: it is intentionally loud. Without restraint it could read as an agency campaign rather than a technology leader’s portfolio.

## Recommendation

Use **Signal Ledger** as the durable system, then borrow **Open Archive’s sparse-hang / dense-index topology**. Do not carry over Dispatch Manual’s signal-lime field; reserve its directness and typographic confidence for key moments only.
