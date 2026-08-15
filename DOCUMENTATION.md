# Ophelia — Business Case & Technical Documentation

*Last updated: August 2026.*

---

## 0. Description

Ophelia takes her name from the Ancient Greek ὠφέλεια (ophéleia), meaning
"help" or "advantage" — and that's exactly the gap she was built to close.

Most personal safety apps make a quiet assumption: that you'll always have
signal when it matters most. But danger doesn't wait for bars on your
phone. It happens in the dead zone on your walk home, the underground
parking lot, the hiking trail, the rural road with no towers for
kilometres. Ophelia is built for exactly that moment — she runs entirely
on-device using edge AI, so she doesn't need a connection to notice that
something is wrong. Using only the sensors already in your pocket —
accelerometer, gyroscope, GPS, microphone — she detects the signs of danger
locally: a sudden fall, a struggle, a deviation from your usual route, a
scream. No server round-trip, no dependency on network availability, no
delay.

When she needs to get help out, she doesn't wait for a signal to appear —
she queues the alert and fires it the instant any connection returns, or
relays it via nearby devices over Bluetooth mesh until it finds a way out.

Beyond individuals, Ophelia is built to scale as safety infrastructure —
licensed into university systems, gig platforms, and lone-worker programs,
protecting not just one person at a time, but entire communities and
institutions at once.

She isn't just named for help. She's built to give it, with or without a
signal.

Pitch positioning statement:

> "While existing hardware solutions like the Alerting Earpiece provide a
> discreet button for victims to press, they depend on the victim being
> conscious and able to act, and on a live connection to reach anyone. We're
> building Ophelia: an offline-first AI safety infrastructure. Edge AI
> detects danger before a button is pressed, mesh networking gets the alert
> out of dead zones, and B2B licensing lets us protect people at
> institutional scale rather than one unit at a time."

---

## 1. The Problem

| Metric | Figure | Source |
|---|---|---|
| SA population, 2025 | ~63.1 million | Stats SA |
| SA women, 2025 | ~32.2 million | Stats SA |
| Women (18+) with lifetime physical violence experience | 7,310,389 (33.1%) | HSRC National GBV Study |
| Women (18+) with lifetime sexual violence experience | 2,150,342 (9.9%) | HSRC National GBV Study |
| Women reporting any lifetime GBV | 51% | HSRC National GBV Study |
| Women killed per day (national) | 15 | SAPS crime stats |
| Rapes reported per day | 115 | SAPS crime stats |
| Women feeling unsafe/very unsafe walking alone at night | 66.2% (~15.16M) | Stats SA, 2024/25 |
| Annual economic cost of GBV | R28.4bn–R42.4bn (0.9–1.3% of GDP) | KPMG |

This is a large, well-documented, currently unsolved problem with a clear
economic cost that institutions (not just individuals) already bear —
which is what makes the B2B angle credible to investors and judges.

---

## 2. The Benchmark: Alerting Earpiece (Mphahlele Alerts)

Bohlale Mphahlele's Alerting Earpiece is a genuinely strong product and a
useful benchmark precisely because it's simple and tangible:

- **Product**: a discreet wearable earring with a hidden panic button.
- **Mechanism**: reactive — pressing the button captures a photo of the
  perpetrator, the victim's GPS location, and alerts preset contacts via a
  paired smartphone.
- **Company**: Mphahlele Alerts (Pty) Ltd, founded to refine and eventually
  launch the product commercially — as of the most recent coverage, still
  pre-launch several years after the original concept.

### Why hardware caps its ceiling

- Requires capital for manufacturing, battery engineering, and supply chain.
- Requires physical retail distribution — one country, one unit at a time.
- Type-approval / regulatory certification for any wireless transmitting
  device (e.g. ICASA in South Africa) before it can legally ship.
- Impact is bound by how many physical units can be produced and sold.
- The mechanism is reactive: the victim must be conscious and physically
  able to press the button, and the paired phone must have connectivity for
  the alert to leave the device at all.

**None of this is a criticism of the idea — it's the reason software is a
structurally different, faster-scaling business for the same problem.**

---

## 3. Ophelia's Answer

### 3.1 Proactive Edge AI (vs. reactive hardware)

Runs on-device machine learning to detect "contextual risk" without
requiring the user to act:

- Sudden stop or gait change consistent with a struggle (accelerometer/gyroscope)
- Aggressive vocal patterns or distress sounds picked up by the microphone
- Route deviation into an unfamiliar or geofenced high-risk area (GPS)
- Prolonged inactivity or a missed check-in
- Fall or crash detection (accelerometer/gyroscope)

A **Dead Man's Switch**: if the app detects the user has entered a known
high-risk zone and then loses connection, it automatically notifies trusted
contacts that the user went offline in a dangerous area — before any SOS is
manually triggered.

### 3.2 Safety states, not a single red button

- 🟢 **Safe** — normal movement, on planned route.
- 🟡 **Attention** — e.g. deviated 800m from planned route, stopped in an
  unfamiliar area.
- 🔴 **High Risk** — e.g. sudden movement + fall detected + no response to a
  confirmation prompt.

The system progresses through an escalation protocol automatically rather
than relying on one binary trigger.

### 3.3 Solving the offline paradox (the question every judge/investor asks)

*"If they're offline, how does the alert actually get out?"*

- **Local-first processing**: detection, analysis, warning, and evidence
  recording all happen on-device — no server required to function.
- **Store-and-forward**: if an SOS is triggered with no connection, the
  event (GPS, timestamp, audio snippet) is queued locally and fires
  automatically the moment any signal — even a faint 2G/edge connection —
  becomes available.
- **BLE mesh relay**: the app can use Bluetooth Low Energy to bounce an
  encrypted SOS packet off nearby phones (including, potentially, non-users
  via OS-level BLE protocols) until it reaches a device with connectivity —
  turning nearby strangers into a decentralized relay network.

This makes the offline claim testable and demoable, not just marketing
language — which is the difference between "low-bandwidth" and a real
technical answer.

### 3.4 Full safety lifecycle

| Phase | What the AI does |
|---|---|
| **Before** | Detects route deviation, geofenced risk zones, prolonged stationary periods, missed check-ins; warns the user |
| **During** | Detects falls, crashes, distress inferred from motion + audio, sudden/abnormal movement; activates the appropriate response |
| **After** | Stores location, timestamp, event history, and optional audio as evidence; transmits once connectivity returns |

---

## 4. Edge AI Architecture — Why Offline AI Is Even Possible

This section exists because it's the single most-asked technical question
in the room: *"How can AI work with no internet at all?"* The short answer
is that this isn't a research problem — it's how a lot of AI you already
use every day works.

### 4.1 Training vs. inference — the distinction that makes this work

AI has two separate phases, and only one of them needs a live connection or
heavy compute:

| | Training | Inference |
|---|---|---|
| What happens | The model learns patterns from data | The already-trained model makes a prediction |
| When | Once, ahead of time, during development | Continuously, every time the app runs |
| Where | Cloud / powerful hardware, offline from the user's perspective | On the user's own phone |
| Needs internet? | Yes, but this is a one-time build step, not something that happens live | No |

Ophelia's models are **trained once, ahead of time** — this is a normal
development step, the same as compiling any other part of the app — and
then shipped *inside* the app itself, the same way a font file or an image
asset is bundled. From that point on, the phone never needs to "call home"
to think.

### 4.2 The analogy

**Cloud AI is like calling a doctor on the phone every time you feel a
symptom.** You describe what's happening, wait for them to answer, they
diagnose you, and tell you what to do. It works — until you're somewhere
with no signal, and then you get no answer at all, even though something is
clearly wrong.

**Edge AI is like having a trained paramedic living in your pocket.** They
already went through years of training (that's the model training — done
once, ahead of time, back at "base"). Now they don't need to call anyone to
recognize a fall, a struggle, or a scream — they just know, instantly, using
only what they can see and hear right there with you. No phone call
required, because the expertise already lives with them, not back at a
hospital.

### 4.3 The technical pipeline

1. **Train** the detection model (motion classification, audio-event
   detection) offline, ahead of shipping, using labeled example data.
2. **Compile/convert** the trained model into a lightweight mobile format —
   TensorFlow Lite (Android), Core ML (iOS), or ONNX Runtime Mobile
   (cross-platform).
3. **Bundle** the compiled model inside the app package.
4. **Run inference locally**: at runtime, the phone's own CPU/NPU processes
   live sensor data (accelerometer, gyroscope, GPS, microphone) through the
   bundled model — entirely on-device, with zero network calls.
5. **Sync when possible**: only logged events (not raw model computation)
   are transmitted once connectivity returns, via store-and-forward.

This is proven, shipping technology — the same underlying principle used by
Face ID, Apple Watch fall detection, and offline voice wake-word detection
("Hey Siri" works with no signal). Ophelia applies the same pattern to
personal safety.

### 4.4 Sensor reality check: what a phone can and can't detect

To keep every claim technically honest under questioning:

| Signal | Available phone-only? | Sensor |
|---|---|---|
| Motion pattern / sudden stop / struggle-like movement | Yes | Accelerometer, gyroscope |
| Fall / crash | Yes | Accelerometer, gyroscope |
| Location / route deviation | Yes | GPS |
| Raised voice, distress sounds, glass breaking, etc. | Yes | Microphone |
| **Pulse / heart rate / HRV** | **No** | Requires a PPG sensor (continuous camera+flash contact isn't practical) or a paired wearable |

Phase 1 (phone-only) relies on **motion + audio + location** as proxies for
distress — this is what's actually feasible and demoable with hardware
everyone already owns. Biometric signals like pulse or heart-rate variability
are a **Phase 2, wearable-integration feature** (smartwatch, fitness band, or
even a partner device like the Alerting Earpiece connecting into Ophelia as
one input among several) — not something the phone-only MVP claims to do.
Being explicit about this distinction is a credibility strength, not a
weakness: it shows the roadmap is grounded in what current hardware can
actually deliver at each stage.

---

## 5. Market Sizing (TAM → SAM → SOM)

Layered, using published South African data rather than invented figures
(Stats SA, HSRC, DHET, Department of Tourism, Department of Mineral and
Petroleum Resources):

```
63.1M South Africans (Stats SA, 2025)
        │
        ▼
~32.2M women
        │
        ▼
15.16M women reporting feeling unsafe walking alone at night (Stats SA, 2024/25)
        │
   ┌────┴─────────────────────────────────────────┐
   ▼                                                ▼
1.7M+ post-school students          10.5M international tourists/year
(universities, TVET, CET — DHET)     (Dept. of Tourism, 2025, +17.7% YoY)
   │                                                │
   ▼                                                ▼
460K mining sector workers            + millions of other lone/field workers,
(Dept. Mineral & Petroleum Resources)   gig-economy drivers, commuters
```

**Layers of go-to-market:**

1. **Personal safety (B2C)** — individuals, students, women, tourists,
   hikers, commuters. Reach: tens of millions in SA alone; free tier drives
   volume, premium tier monetizes power users.
2. **Institutional (B2B2C)** — universities bundle Ophelia into the student
   package. One sale = tens of thousands of users, not one-by-one
   acquisition.
3. **Tourism** — hotels/airlines distribute an offline "Johannesburg / Cape
   Town / Kruger safety pack" (maps, safe routes, emergency contacts,
   itinerary) pre-loaded before travelers lose Wi-Fi.
4. **Enterprise / lone-worker compliance (B2B SaaS)** — mining, construction,
   real estate, logistics fleets pay per active user for location tracking,
   geofencing, fall/inactivity detection, and incident dashboards.
5. **B2G** — anonymized "heat map" data (poorly lit streets, high-incident
   zones, dead zones) licensed to municipalities for urban planning and
   policing resource allocation.
6. **Insurance (B2B2C)** — insurers distribute Ophelia to policyholders in
   exchange for behavioural/incident data that can reduce claims costs.
7. **Continental expansion** — the underlying problem (unreliable
   connectivity + personal/worker safety) is not uniquely South African.
   Natural expansion path: SA → Botswana → Namibia → Zimbabwe → Zambia →
   Kenya → Ghana → Nigeria → other emerging markets.

---

## 6. Business Model & Illustrative Revenue

| Tier | Customer | Pricing (illustrative) |
|---|---|---|
| Free | Individuals | SOS, trusted contacts, basic location sharing, offline safety map |
| Premium | Individuals | R49–R99/month — AI risk detection, route monitoring, evidence vault, family circles, wearable integration |
| B2B SaaS | Enterprises, mining, campuses | R20–R40/active user/month |
| B2G | Municipalities | Data licensing fee |
| B2B2C | Insurers, tourism boards, airlines | White-label / revenue share |

**Worked example (illustrative, not a forecast — to be validated via pilot):**

- One enterprise customer, 10,000 workers, at R30/user/month
  → R300,000/month → **R3.6M/year** from a single account.
- 20 such enterprise accounts → **~R72M/year**, before any consumer
  subscriptions, tourism partnerships, or insurance revenue.

---

## 7. Head-to-Head Comparison

| | Alerting Earpiece (hardware) | Ophelia (software) |
|---|---|---|
| Trigger mechanism | Reactive — requires a conscious, able victim to press a button | Proactive — Edge AI detects risk without user action |
| Offline answer | Alert depends on paired phone having connectivity | Store-and-forward + BLE mesh; fires on first available signal |
| Distribution | Physical retail, manufacturing, logistics | App store — instant, borderless |
| Unit economics | BOM + manufacturing + regulatory approval per unit | Near-zero marginal cost per additional user |
| Time to market | Founded 2020; still pre-launch in most recent coverage | Deployable and demoable now |
| Revenue model | One-time hardware purchase (B2C) | Recurring B2C + B2B SaaS + B2G + B2B2C |
| Iteration | Requires new hardware revision per feature | OTA software updates |
| Realistic 5-year reach (funded) | ~50,000–100,000 units, hardware-constrained | Millions, via B2B2C licensing (e.g. gig platforms, universities) |

---

## 8. Impact Measurement Framework

Rather than reporting downloads, define and track people actually protected:

- Users protected (Year 1 / Year 2 / Year 3 — illustrative targets:
  50,000 → 250,000 → 1,000,000+)
- Emergency events detected and successfully escalated
- Average alert/response time
- False-positive rate
- Kilometres of routes monitored
- Dangerous route deviations prevented / flagged before escalation
- Organizations and institutions onboarded
- Workers, students, and travelers protected under institutional accounts

---

## 9. What Still Needs to Be Proven

Being explicit about this is what separates a credible pitch from a
hand-wave — judges and investors will ask about these directly:

- Real-world usage and retention, not just concept validation
- Accuracy of AI event detection (and an acceptable false-positive rate)
- Battery consumption under continuous background monitoring
- Willingness of institutions to actually pay at the modeled price points
- Integration feasibility with real emergency/communication channels
- Regulatory and data-privacy model (especially for location/audio capture)
- Unit economics of acquisition vs. deployment cost per segment

---

## 10. Positioning Statement (for the pitch)

**Bohlale's innovation**: a discreet physical device that lets someone in
danger trigger an emergency response.

**Ophelia's innovation**: an AI-powered safety ecosystem that continuously
protects people before, during, and after dangerous situations — even when
connectivity is unreliable.

- Her product: **Device → Alert → Contact**
- Ophelia: **Predict → Prevent → Detect → Respond → Recover**

Her device solves an emergency-trigger problem. Ophelia solves a continuous
safety problem, at institutional scale, with a recurring-revenue business
model behind it.

---

## 11. Sources

- Human Sciences Research Council (HSRC), First South African National
  Gender-Based Violence Study
- Statistics South Africa (Stats SA), population estimates and 2024/25
  perceptions-of-safety survey
- South African Police Service (SAPS) crime statistics
- KPMG, cost-of-GBV estimate
- Department of Higher Education and Training (DHET), enrolment figures
- Department of Tourism, international arrivals data
- Department of Mineral and Petroleum Resources, mining employment figures
- GoodThingsGuy, "From Schoolgirl to Safety Pioneer, Bohlale Mphahlele is
  Building a Safer SA" (benchmark product background)