# The Signal Garden

A dependency-free, privacy-conscious kinetic portfolio for the existing Netlify project.

## Local workflow

```sh
npm run build
npm test
npm run lint
python3 -m http.server 4173 --directory dist
```

Production source lives in `src/`; `npm run build` replaces `dist/` with a deterministic deployable build and preserved favicon/redirect data from `public/`. The site includes the intentional public mailbox address `wdp@wdpronovost.com` and GitHub profile link. It includes no analytics, remote fonts, remote runtime assets, forms, or trackers.

The previous Signal Garden prototype is preserved under `prototypes/signal-garden-v1/` and is not published.
