# Ophelia — Offline-First AI Safety Companion

*From the Ancient Greek ὠφέλεια (ophéleia) — "help, advantage."*

> Predict → Prevent → Detect → Respond → Recover
> An AI-powered safety platform that protects people before, during, and after
> dangerous situations — with or without a signal.

---

## 1. Description

Most personal safety apps make a quiet assumption: that you'll always have
signal when it matters most. But danger doesn't wait for bars on your
phone. It happens in the dead zone on your walk home, the underground
parking lot, the hiking trail, the rural road with no towers for
kilometres.

Ophelia is built for exactly that moment. She runs entirely on-device using
edge AI, so she doesn't need a connection to notice that something is
wrong. Using only the sensors already in your pocket — accelerometer,
gyroscope, GPS, microphone — she detects the signs of danger locally: a
sudden fall, a struggle, a deviation from your usual route, a scream. No
server round-trip, no dependency on network availability, no delay.

When she needs to get help out, she doesn't wait for a signal to appear —
she queues the alert and fires it the instant any connection returns, or
relays it via nearby devices over Bluetooth mesh until it finds a way out.

Beyond individuals, Ophelia is built to scale as safety infrastructure —
licensed into university systems, gig platforms, and lone-worker programs,
protecting not just one person at a time, but entire communities and
institutions at once.

She isn't just named for help. She's built to give it, with or without a
signal.

---

## 2. The Problem

South Africa's gender-based violence crisis is not a story problem, it's a
numbers problem:

| Metric | Figure | Source |
|---|---|---|
| Women (18+) who have experienced physical violence in their lifetime | 7,310,389 (33.1%) | HSRC National GBV Study |
| Women who have experienced sexual violence in their lifetime | 2,150,342 (9.9%) | HSRC National GBV Study |
| Women reporting any lifetime GBV | 51% | HSRC National GBV Study |
| Women killed per day | 15 | SAPS crime stats |
| Rapes reported per day | 115 | SAPS crime stats |
| Women who feel unsafe/very unsafe walking alone at night | 66.2% (~15.16M) | Stats SA, 2024/25 |
| Annual cost of GBV to the SA economy | R28.4bn – R42.4bn (0.9–1.3% of GDP) | KPMG |

Existing personal-safety products — including hardware solutions like the
**Alerting Earpiece** (Mphahlele Alerts) — are reactive: they require the
victim to be conscious and physically able to press a button, and they
depend on a connected paired phone to send the alert. Hardware also carries
manufacturing, supply chain, battery, and distribution constraints that cap
how many people it can ever reach.

## 3. The Solution

Ophelia is **software, not a device** — an AI safety layer that runs on
the smartphone people already own, and works whether or not that phone has
signal.

- **Proactive Edge AI**: on-device ML detects contextual risk (sudden stop,
  fall, distress in voice) without requiring the user to act.
- **Offline-first**: detection, analysis, and evidence capture all happen
  locally. Nothing requires a live server connection to work.
- **Store-and-forward + BLE mesh**: in a dead zone, an SOS is queued locally
  and/or relayed via Bluetooth Low Energy to nearby devices until it reaches
  a connection point — solving the "how does the alert escape a dead zone"
  problem that reactive, phone-paired hardware doesn't answer.
- **Safety states, not just a red button**: 🟢 Safe → 🟡 Attention →
  🔴 High Risk, with an automatic escalation protocol rather than a single
  binary trigger.

### Why offline AI is even possible: edge AI, in one line

A model is **trained once, ahead of time**, then compiled into a lightweight
format (TensorFlow Lite / Core ML / ONNX Runtime Mobile) and **bundled
inside the app**. At runtime, the phone's own CPU/NPU runs that model
locally against whatever the phone's sensors are already producing — no
network call happens during inference. This is proven, shipping technology
(the same principle behind Face ID and Apple Watch fall detection), not a
research bet. See `DOCUMENTATION.md` §4 for the full breakdown, including
exactly which signals a phone-only MVP can and can't detect.

## 4. Who It's For

Not just individuals — Ophelia is designed to be licensed into the apps and
systems people already use:

- Individuals, students, tourists, commuters, hikers
- Gig-economy platforms and delivery fleets (Uber, Bolt, DoorDash-style)
- Universities and campus safety programs
- Mining, construction, real estate — "lone worker" duty-of-care compliance
- Municipalities (anonymized safety heat-map data)
- Insurers (behavioural/incident data → fewer, better-quality claims)

## 5. Business Model

| Tier | Customer | Model |
|---|---|---|
| B2C Free | Individuals | SOS, trusted contacts, basic location sharing, offline safety map |
| B2C Premium | Individuals | ~R49–R99/month — AI risk detection, route monitoring, evidence vault, family circles |
| B2B SaaS | Corporates, mining, campuses | Per-active-user monthly fee (illustrative: R20–R40/user/month) |
| B2G | Municipalities | Anonymized safety/heat-map data licensing |
| B2B2C | Insurers, tourism boards, airlines | White-label / embedded safety layer |

See `DOCUMENTATION.md` for the full TAM/SAM/SOM breakdown and worked
enterprise-revenue examples.

## 6. How This Compares to the Benchmark

| | Alerting Earpiece (hardware) | Ophelia (software) |
|---|---|---|
| Trigger | Reactive — victim must press a button | Proactive — AI detects risk without user action |
| Offline answer | Relies on paired phone's connection | Store-and-forward + BLE mesh |
| Scale ceiling | Bound by manufacturing/distribution | Zero marginal cost per new user |
| Time to market | Founded 2020, still pre-launch | Deployable now |
| Revenue model | One-time hardware sale | Recurring B2C + B2B SaaS |

## 7. Status & Roadmap

**Phase 1 — phone-only (MVP):** motion, audio, and location signals only —
no biometric sensing. This is what's feasible on hardware everyone already
owns and what the current demo targets.

- [ ] Working offline demo (local risk detection + store-and-forward)
- [ ] BLE mesh relay proof-of-concept
- [ ] Pilot with one institutional partner (university or fleet)
- [ ] Validate false-positive rate and battery consumption
- [ ] Formalize B2B pricing via pilot data (current figures are illustrative, not forecasts)

**Phase 2 — wearable integration:** pulse/HRV and other biometric signals via
a paired wearable (smartwatch, fitness band, or third-party device), adding
higher-fidelity distress detection on top of the phone-only baseline.

## 8. Getting Started

```bash
# clone and install — fill in once the stack is finalized
git clone <repo-url>
cd ophelia
```

*(Add setup/run instructions here once implementation begins.)*

## 9. Further Reading

See [`DOCUMENTATION.md`](./DOCUMENTATION.md) for the full business case,
market sizing, edge AI architecture, and impact-measurement framework.