# Billy Pronovost — in Practice

A dependency-free, privacy-conscious portfolio for Billy Pronovost. The production homepage presents six connected Modes of Practice and a public-safe living inventory of selected and ongoing work.

## Local workflow

```sh
npm run build
npm test
npm run lint
python3 -m http.server 4173 --directory dist
```

Production source lives in `src/`; `npm run build` replaces `dist/` with a deterministic deployable build and preserved favicon, redirect data, and comparison directions from `public/`. The site includes the intentional public mailbox address `wdp@wdpronovost.com`. It includes no analytics, remote fonts, remote runtime assets, forms, or trackers.

Earlier Signal Garden homepage implementations are preserved under `prototypes/signal-garden-v1/` and `prototypes/signal-garden-v2/`; neither is published by Netlify. Design comparison routes remain available under `/directions/`.
