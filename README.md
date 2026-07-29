# Billy Pronovost — in Practice

A dependency-free, privacy-conscious portfolio for Billy Pronovost. The production homepage presents six connected Modes of Practice and a public-safe living inventory of selected and ongoing work.

## Local workflow

```sh
npm run build
npm test
npm run lint
python3 -m http.server 4173 --directory dist
```

Production source lives in `src/`; `npm run build` replaces `dist/` with a deterministic deployable build and preserved favicon, redirects, local images, and the public Open Design Lab from `public/`. Contact uses a private Netlify form with no public destination address. The site includes no analytics, remote fonts, remote runtime assets, or trackers.

Earlier Signal Garden homepage implementations and rejected design directions remain source-only references and are not published by Netlify.
