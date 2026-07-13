# Resume Versions

Archived, self-contained snapshots of the resume. Each folder holds its own
`index.html`, a PDF, and `assets/` so it renders independently. There are two axes:
**design** editions (same iOS Tech Lead content, different look) and **role** editions
(same Editorial design, content retargeted to a specific job title).

## Design editions

| Version | Folder | Design | Palette / Type | Vibe |
|--------|--------|--------|----------------|------|
| 2026-06 · **Editorial** | [`2026-06-editorial/`](./2026-06-editorial/) | Editorial broadsheet | Warm paper + oxblood · Fraunces / Hanken / JetBrains Mono | Magazine-grade, refined. **Current live design.** |
| 2026-06 · **Terminal** | [`2026-06-terminal/`](./2026-06-terminal/) | Dark engineering console | Near-black IDE + green/amber/cyan · JetBrains Mono | Unmistakably "engineer," striking on screen. |
| 2026-06 · **Swiss** | [`2026-06-swiss/`](./2026-06-swiss/) | Swiss / brutalist grid | Stark white + electric blue · Anton / Archivo | Bold, art-directed studio portfolio. |

The three design editions keep the full iOS Tech Lead content (8 roles, 6 projects, full
portfolio index, skills, education, honours) and the portrait.

## Target editions (2026-07, Editorial design)

Two editions, one per job family — each covers every title in its family (swap the top role
line per application). Each exports a Riyadh + Cairo PDF.

| Family | Covers | Folder | PDF |
|--------|--------|--------|-----|
| **iOS** | iOS Tech Lead · iOS Team Lead · Senior iOS Engineer | [`2026-07-ios/`](./2026-07-ios/) | `Ahmad_iOS_Resume.pdf` |
| **Mobile** | Mobile Architect · Mobile Team Lead (iOS + Android) | [`2026-07-mobile/`](./2026-07-mobile/) | `Ahmad_Mobile_Resume.pdf` |

The iOS edition leads with iOS craft/leadership; the Mobile edition leads with cross-platform
(iOS + Android) breadth. Both keep the solo ride-hailing platform's four-platform "delivery
timeline" as proof of architectural range.

Each edition has a **terminal-design twin** at `2026-07-<family>-terminal/` carrying the same
content in the dark IDE look. The editorial edition's **"See the live interactive edition"**
button links to its twin.

Each page 1 is packed top-to-bottom — no blank space.

## Location: Riyadh / Cairo

Every contact-bearing edition (editorial + swiss designs; terminal has no phone/Bureau)
switches between a **Riyadh** and **Cairo** version from a single source — no duplicated files:

- **Default = Riyadh** — `Bureau: Riyadh, Saudi Arabia`, phone `+966 … · +20 …` (Saudi first).
- **Cairo** — append **`?loc=cairo`** to any live URL → `Bureau: Cairo, Egypt`, phone `+20 … · +966 …`
  (Egyptian first). The "live interactive edition" link carries `?loc` through to the terminal twin.
- **PDFs** — `npm run pdf` exports both per edition: the default name (Riyadh) and a
  `…_Cairo_Resume.pdf`. Send the file that matches the job's city.

A small inline script (keyed off the `.k` contact labels) drives it; the location value lives
in one place per file.

The root `index.html` (served on GitHub Pages) mirrors whichever version is live
(currently **Editorial**). To switch the live design, copy a version's `index.html`,
`assets/`, and PDF up to the repo root.
