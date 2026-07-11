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

## Role editions (2026-07, Editorial design)

Content retargeted per job title — headline, summary, emphasis, and skills/projects
reordered — while staying truthful. Each exports a role-named PDF.

| Target role | Folder | PDF |
|--------|--------|-----|
| **Mobile Team Lead** | [`2026-07-mobile-team-lead/`](./2026-07-mobile-team-lead/) | `Ahmad_MobileTeamLead_Resume.pdf` |
| **Senior Mobile Developer** | [`2026-07-senior-mobile-dev/`](./2026-07-senior-mobile-dev/) | `Ahmad_SeniorMobileDeveloper_Resume.pdf` |
| **Engineering Manager** | [`2026-07-engineering-manager/`](./2026-07-engineering-manager/) | `Ahmad_EngineeringManager_Resume.pdf` |
| **CTO** (Engineering Leader · CTO track) | [`2026-07-cto/`](./2026-07-cto/) | `Ahmad_CTO_Resume.pdf` |
| **Fullstack Developer** | [`2026-07-fullstack/`](./2026-07-fullstack/) | `Ahmad_FullstackDeveloper_Resume.pdf` |

Each role edition also has a **terminal-design twin** at `2026-07-<role>-terminal/` carrying the
same retargeted content in the dark IDE look. The editorial edition's **"See the live interactive
edition"** button links to its twin.

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
