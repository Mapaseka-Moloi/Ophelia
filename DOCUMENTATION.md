# GirlMentor — Product & Technical Documentation

> GirlMentor is an AI life-path navigator for girls and young women in South Africa.
> This file documents the system that actually ships in `index.html`.
> The repository was originally "Ophelia", an offline-first AI safety companion — see
> [Project history](#12-project-history-ophelia) at the end for what changed and why.

*Last updated: November 2026.*

---

## 1. What GirlMentor does

GirlMentor turns a learner's **stage, subjects, marks, interests and location** into a
personalised pathway, then connects that pathway to opportunities, funding guidance and
human mentors.

The flow a learner follows:

1. **Build a profile** — stage (High School, University, TVET College, Graduate, Self-taught,
   Job Seeker), grade/year/level, qualification, country and city/town, subjects with a mark
   slider each, interests, career goal, and whether financial support is needed.
2. **Generate a path** — the pathway engine scores the profile against goal requirements and
   renders routes, a step-by-step pathway, matched opportunities and ranked mentors.
3. **Explore "what if" scenarios** — drop Mathematics, drop Physical Sciences, or assume no
   university funding, and watch the routes and status change live.
4. **Get guidance** — an AI coach answers questions about NSFAS, maths, TVET, study plans and
   interviews, with an offline fallback when there is no connection.

Aligned with **SDG 4 (Quality Education)** and **SDG 5 (Gender Equality)**.

---

## 2. How it is built

| Layer | Implementation |
|---|---|
| Front end | Single `index.html`: markup, CSS and JavaScript. No build step, no framework |
| Fonts | Inter + Playfair Display (Google Fonts) |
| Pathway engine | Rule-based, local, in `index.html` (`GOAL_REQUIREMENTS`, scoring functions) |
| AI layer | Simulated FastAPI + Gemini 2.5 Flash responses with a local offline fallback |
| Server | `server.js` — zero-dependency Node static file server (`npm start`) |
| Tests | `scripts/smoke-test.js` — jsdom harness that drives the real UI (`npm test`) |

Everything runs in the browser, so the whole product works with no backend, which is
deliberate: the target users are frequently on low-cost data, shared devices and load shedding.

### 2.1 Screens

| Screen | Purpose |
|---|---|
| `screen-landing` | Value proposition, entry points, pricing (Free / Premium / Sponsor) with monthly-annual billing toggle |
| `screen-profile` | Profile builder: personal details, location search, subjects + marks, interests, goal, financial-need flag |
| `screen-dashboard` | Generated path: profile summary, goal status, what-if simulator, routes, pathway steps, opportunities, mentors, impact metrics, AI coach |
| `screen-sponsor` | Sponsor / NPO / corporate CSI dashboard with impact metrics and sponsor packages |
| `screen-architecture` | Explains the production architecture (frontend, backend API, AI service, data, offline-first, trust & safety) |

Navigation is `showScreen(name)`, which toggles the `.hidden` class on each section.

---

## 3. The pathway engine

All rules live in one place at the bottom of `index.html`.

### 3.1 Inputs

`readProfileFromForm()` produces the profile object:

```js
{
  name, stage, level, qualification, country, city,
  subjects: [{ name, mark }],     // only ticked subjects
  interests: [ ... ],             // ticked interest chips
  goal,                           // select#goal
  financialNeed                   // checkbox
}
```

`effectiveSubjects()` returns the subject → mark map **after** what-if changes are applied
(dropping maths/science deletes those keys), so every downstream rule automatically sees the
simulated profile rather than the real one.

### 3.2 Goal requirements

`GOAL_REQUIREMENTS` maps each of the 19 goals to:

- `subjects` — required subjects, `alt` — acceptable alternatives
- `minMark` — the mark threshold for those subjects
- `routes` — three routes (typically university, TVET, and an alternative/self-directed path)

Example: Cybersecurity requires Mathematics at 60%+ and offers
*University CS/IT degree*, *TVET ICT diploma + certs*, *Self-taught + Security+ path*.
The `Not sure yet` goal deliberately has no requirements and offers exploratory routes, so a
learner who has not decided is never told she is "blocked".

### 3.3 Status logic (`goalStatus()`)

| Condition | Status |
|---|---|
| Required subject missing | **At risk** (pink) |
| Required subject below `minMark` | **Needs work** (amber) |
| No-university what-if plus financial need | **Alternative needed** (amber) |
| Otherwise | **On track** (green) |

### 3.4 Route rendering (`renderRoutes()`)

Each route card is classified as *Recommended*, *Option* or *Blocked*:

- the first route is recommended by default;
- with the *no university* what-if active, TVET/learnership/bootcamp/self-taught routes become
  recommended instead;
- university CS/engineering routes show as **Blocked** when maths has been dropped;
- every route carries short, concrete advice (`routeAdvice()`), for example NSFAS deadlines or
  portfolio-building tips.

### 3.5 Pathway steps (`pathwaySteps()`)

A fixed sequence of actionable cards: subject lock-in, load-shedding-proof studying, funding
(NSFAS, only when financial need is flagged), proof + people, plus a journey preview step when
a life-stage preview is selected. Subject tasks are generated from the actual marks, including
an explicit URGENT warning when maths is missing for a maths-dependent goal.

### 3.6 Matching (`renderOpportunities()`, `renderMentor()`)

- **Opportunities** — 10 seeded South African opportunities (NSFAS, corporate bursaries, TVET,
  GirlCode, SAWISE, NYDA, expos/olympiads, NFVF, Funza Lushaka, SETA learnerships). Each is
  scored: +2 for a financial-need match, +2 per matching interest/goal tag, +2 for TVET when
  the no-university what-if is active. The top 6 are shown; the count of positive scores feeds
  the "Opportunities matched" metric.
- **Mentors** — 6 "Ask a Sister" mentors scored by tag overlap with interests/goal; the top 3
  are shown.
- **Impact metrics** are computed from the render pass (subjects tracked, routes generated,
  opportunities matched, mentors suggested) rather than hard-coded.

### 3.7 AI coach (`askAiCoach()`)

Keyword routing over a fixed answer set (nsfas, maths, tvet, study, interview), with a default
answer referencing the learner's goal. In offline mode answers are prefixed/suffixed with the
offline-fallback marker. The production version will call FastAPI → Gemini 2.5 Flash
server-side; the prototype simulates this so the demo has no API key and no network dependency.

---

## 4. State

```js
AppState = {
  profile,                       // current learner profile (null until generated)
  plan: 'free' | 'premium',
  billing: 'monthly' | 'annual',
  offline: false,                // manual offline toggle + banner
  whatIf: { dropMaths, dropScience, noUniversity },
  journey,                       // selected life-stage preview
  oppMatched, mentorMatched      // written during render, read by impact metrics
}
```

State lives in memory for the session. There is no account system and no persistence yet —
refreshing the page returns to the landing screen. See the roadmap.

---

## 5. Running the project

```bash
npm install     # dev dependency only (jsdom) — the app itself has none
npm start       # zero-dependency static server → http://localhost:3000
npm test        # jsdom smoke test of every main flow
```

Alternatives:

```bash
npx serve .     # equivalent, if you prefer serve
# or open index.html directly in a browser — no server required
```

`server.js` serves the project directory with correct MIME types, blocks path traversal
(`%2e%2e` → 403) and returns 404 for unknown paths. Set a port with `PORT=8080 npm start`
or `node server.js 8080`.

---

## 6. Testing

`npm test` loads the real `index.html` in jsdom, runs the page scripts, and asserts on the
rendered DOM:

- landing screen visible, demo profile (Amahle) loads with subjects
- dashboard renders routes, pathway, opportunities, mentors, impact metrics
- what-if toggles change the pathway and reset restores it exactly
- AI coach produces a visible answer
- every screen navigates
- profile form round-trip (fill → read → identical)
- billing/plan controls, country and city search, offline toggle, edit/reset
- `Not sure yet` goal shows exploratory routes and "Exploring" status
- impact metrics are numeric and real

The suite exits non-zero on any failure or console error. A headless Chrome load of the served
page is clean (no console errors).

---

## 7. Plans

| Plan | Price | Included |
|---|---|---|
| Free | R0 | Basic AI guidance, subject selection help, public opportunities, offline fallback |
| Premium | R99/month, or R79/month billed annually | Custom study plans, AI business coaching, unlimited interview prep, priority mentor matching, localised NSFAS/bursary guidance, 7-day trial |
| Sponsor / NPO | Custom | Sponsored learners, funded "Ask a Sister" mentors, outcome tracking, corporate CSI dashboard |

Sponsor packages: Learner Sponsor (R250/month), Mentor Sponsor (R5,000/month),
Corporate CSI Partner (custom).

---

## 8. Production architecture (target)

The architecture screen in the app describes the intended system:

- **Frontend** — mobile-first web app (React + Tailwind for production)
- **Backend API** — FastAPI with validated schemas, auth, profile/pathway/opportunity/mentor
  endpoints
- **AI service** — Gemini 2.5 Flash called server-side so keys never reach the browser
- **Data** — live NSFAS, TVET, bursary and opportunity data with CSI impact reporting
- **Offline-first** — cached guidance plus the same local pathway rules, so the app keeps
  working during load shedding or in rural areas with no signal
- **Trust & safety** — vetted mentors, safeguarding, anonymised sponsor reporting, POPIA-aware
  data handling

---

## 9. Roadmap

- [ ] Replace placeholder opportunity data with live, sourced bursary and NSFAS listings
- [ ] Real mentor sign-up, vetting and matching
- [ ] Service worker for true offline-first caching
- [ ] Accounts and saved pathways (currently session-only state)
- [ ] FastAPI + Gemini backend behind the simulated AI layer
- [ ] Pilot with a school or NPO partner, then validate recommendations with learners and
      counsellors

---

## 10. Known limitations

- Guidance content (NSFAS deadlines, bursary names) is illustrative and must be verified
  against current official sources before real learners rely on it.
- Mentor profiles are seeded placeholders, not real people.
- The AI coach is a deterministic keyword simulation, not a language model.
- Impact numbers on the sponsor dashboard are sample figures for demo purposes.

---

## 11. Sources used for the SA context

- NSFAS (funding application process and deadlines)
- DHET / TVET College enrolment information
- Stats SA (population and education statistics)
- Department of Basic Education (subject and curriculum requirements)

---

## 12. Project history (Ophelia)

This repository started as **Ophelia**, an offline-first personal-safety companion that used
on-device sensors (accelerometer, gyroscope, GPS, microphone) to detect danger and
store-and-forward/BLE mesh to get alerts out of dead zones, including a detailed business case
against the Alerting Earpiece benchmark.

The codebase was then re-scoped for the GirlCode hackathon into **GirlMentor**, an education
product — the same offline-first philosophy (works with no connection, targets low-data and
load-shedding contexts) applied to subject choices, TVET/university routes, NSFAS and
mentoring instead of personal safety.

Only the *product* changed; the engineering constraints that shaped Ophelia — no build step,
no network requirement, runs on a low-end phone browser — carried over and are why
GirlMentor is a single dependency-free HTML file.
