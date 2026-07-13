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
reordered — while staying truthful. Each exports a role-named PDF. The editions are grouped
into two job families: **iOS roles** and **Mobile roles**.

### iOS roles

| Target role | Folder | PDF |
|--------|--------|-----|
| **iOS Tech Lead** | [`2026-07-ios-tech-lead/`](./2026-07-ios-tech-lead/) | `Ahmad_iOSTechLead_Resume.pdf` |
| **iOS Team Lead** | [`2026-07-ios-team-lead/`](./2026-07-ios-team-lead/) | `Ahmad_iOSTeamLead_Resume.pdf` |
| **Senior iOS Engineer** | [`2026-07-senior-ios-engineer/`](./2026-07-senior-ios-engineer/) | `Ahmad_SeniorIOSEngineer_Resume.pdf` |

### Mobile roles

| Target role | Folder | PDF |
|--------|--------|-----|
| **Mobile Architect** | [`2026-07-mobile-architect/`](./2026-07-mobile-architect/) | `Ahmad_MobileArchitect_Resume.pdf` |
| **Mobile Team Lead** | [`2026-07-mobile-team-lead/`](./2026-07-mobile-team-lead/) | `Ahmad_MobileTeamLead_Resume.pdf` |

The iOS-focused editions lead with iOS craft/leadership; the Mobile editions lead with
cross-platform (iOS + Android) breadth. All five keep the solo ride-hailing platform's
four-platform "delivery timeline" as proof of architectural range.

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
