# HTML → PDF Conversion Guide

This résumé ships as several HTML editions, and each has a matching downloadable
PDF. The PDFs are **generated from the HTML** — never hand-edited — so whenever
you change an `index.html`, you regenerate the PDFs with one command.

> **TL;DR**
> ```bash
> npm install            # once
> npm run pdf            # regenerate every PDF after editing any HTML
> ```

---

## 1. The editions

| id (CLI)    | Source HTML                            | Output PDF                                                   | Stylesheet | Margin |
|-------------|----------------------------------------|-------------------------------------------------------------|------------|--------|
| `root`      | `index.html`                           | `Ahmad_iOS_TechLead_Resume.pdf`                             | `print`    | 0 mm   |
| `editorial` | `versions/2026-06-editorial/index.html`| `versions/2026-06-editorial/Ahmad_iOS_TechLead_Resume.pdf` | `print`    | 0 mm   |
| `terminal`  | `versions/2026-06-terminal/index.html` | `versions/2026-06-terminal/Ahmad_iOS_TechLead_Resume.pdf`  | `screen`   | 9 mm   |
| `swiss`     | `versions/2026-06-swiss/index.html`    | `versions/2026-06-swiss/Ahmad_iOS_TechLead_Resume.pdf`     | `print`    | 8 mm   |

`root` and `editorial` are the same design (the main downloadable résumé).

Every PDF is exported as **one continuous-scroll page** (no page breaks), sized
to its full content height — a true 1:1 of the web design.

---

## 2. Setup (once)

The exporter drives a real Chrome via [Puppeteer](https://pptr.dev/). Two ways:

### Option A — puppeteer-core + an existing Chrome (recommended, smaller)

```bash
npm install
```

This installs `puppeteer-core` (no browser download). It will use, in order:

1. `$CHROME_PATH` if set,
2. your system **Google Chrome** (`/Applications/Google Chrome.app/...` on macOS),
3. Chrome on common Linux paths.

To pin an exact Chrome (e.g. to keep PDF metadata stable), install a known build
and point at it:

```bash
npx @puppeteer/browsers install chrome@147
export CHROME_PATH="$PWD/chrome/mac_arm-147.0.7727.117/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
```

### Option B — full puppeteer (downloads its own Chromium)

```bash
npm install puppeteer
```

The script auto-detects either package; no code change needed.

---

## 3. Regenerating

```bash
npm run pdf                 # all editions
node scripts/generate-pdf.js root            # just the main résumé
node scripts/generate-pdf.js terminal swiss  # a subset
```

Sample output:

```
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Generating 4 edition(s):
  root       → Ahmad_iOS_TechLead_Resume.pdf
             pages=1 ✓  box=[0 0 594.95996 4169.04]  contentH=5559px
  ...
Done.
```

`pages=1 ✓` confirms a single continuous page. A `⚠ expected 1 page` means
something broke the layout — see Troubleshooting.

After regenerating, **always open the PDFs and skim top-to-bottom** to confirm
nothing is clipped, then commit the changed `.pdf` files alongside the HTML.

---

## 4. How it works (and why)

The conversion lives in `scripts/generate-pdf.js`. For each edition it:

1. **Picks the stylesheet** — `page.emulateMediaType('print' | 'screen')`.
   Most editions look right with their `@media print` rules. The **terminal**
   edition's print styles collapse its layout, so it renders with `screen`.
2. **Renders at the printable width** — viewport width = `210mm − 2 × margin`,
   so wrapping matches the final page exactly.
3. **Measures the full content height** with
   `document.documentElement.getBoundingClientRect().height`.
4. **Injects an `@page` rule** sizing a single page to that height plus the
   margins:
   ```css
   @page { size: 210mm <contentHeight + 2*margin>px; margin: <margin>mm; }
   ```
5. **Exports** with `page.pdf({ printBackground: true, preferCSSPageSize: true })`.

### Why this approach (the important part)

- **`preferCSSPageSize` + injected `@page` — not `pdf({ width, height })`.**
  Forcing the size through `page.pdf()`'s `width`/`height` options makes Chrome
  lay the content out differently from what you measured, so the page comes out
  mostly blank with the content crammed into a corner. Letting Chrome own the
  page size via CSS is what produces a correct continuous page. **Do not switch
  back to passing `width`/`height` to `page.pdf()`.**
- **`printBackground: true`** keeps paper texture, the terminal's dark theme, and
  all colour fills.
- **Measure at the printable width**, otherwise text wraps at a different width
  than it renders and the measured height is wrong (content gets clipped or
  floats with extra whitespace).
- **The 500 ms wait** lets web fonts load and any `.reveal`/animation styles
  settle before measuring — measuring too early gives a short, clipped page.

---

## 5. Making changes

### Edited text/layout in an HTML edition
Just rerun the matching edition: `node scripts/generate-pdf.js <id>` (or
`npm run pdf` for all). Nothing else to touch — the page auto-sizes to the new
content height.

### Added a brand-new edition
1. Create the new `versions/.../index.html`.
2. Add an entry to the `EDITIONS` array in `scripts/generate-pdf.js`:
   ```js
   { id: 'newname', html: 'versions/.../index.html',
     pdf: 'versions/.../Ahmad_iOS_TechLead_Resume.pdf',
     media: 'print', margin: 0 },
   ```
3. Pick `media`/`margin` (start with `print` / the edition's `@page` margin),
   run it, and eyeball the result. If the layout looks collapsed, switch
   `media` to `screen`.

### Want classic multi-page A4 instead of continuous?
Replace the per-edition export with:
```js
await page.pdf({ path, printBackground: true, format: 'A4', preferCSSPageSize: true });
```
(Remove the height-measuring + `@page` injection.) This was the previous
behaviour; the project intentionally uses continuous scroll now.

---

## 6. Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| Page is mostly blank, content crammed in a strip | The width/height path was reintroduced. Use the `@page` + `preferCSSPageSize` method (current default). |
| Bottom content clipped / page too short | Measuring before fonts/animations settle. Increase the wait, or ensure `.reveal` elements are visible in the chosen media. |
| Layout looks collapsed/wrong for one edition | Wrong `media`. Toggle that edition between `print` and `screen`. |
| Colours/backgrounds missing | `printBackground` got turned off — keep it `true`. |
| `Missing dependency` error | Run `npm install` (installs `puppeteer-core`), or `npm i puppeteer`. |
| Can't find Chrome | Set `CHROME_PATH` to a Chrome binary, or `npm i puppeteer`. |
| `⚠ expected 1 page` in output | Content exceeded the single page (rare). Re-check the injected `@page` height math / the measured `contentH`. |

---

## 7. Reproducible metadata (optional)

PDFs record the Chrome version that made them (e.g. `Producer: Skia/PDF m147`).
To keep that stable across machines, pin Chrome with
`npx @puppeteer/browsers install chrome@147` and export `CHROME_PATH` (see §2).
Functionally any recent Chrome works; only the embedded metadata differs.
