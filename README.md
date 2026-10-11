# GirlMentor: AI Life-Path Navigator

> Know your next move.

GirlMentor helps girls and young women in South Africa understand how the choices they make today shape the opportunities available to them tomorrow. It turns a learner's stage, subjects, marks and interests into a personalised pathway, and connects them to opportunities, funding guidance and human mentors.

Built for the GirlCode hackathon. Aligned with **SDG 4 (Quality Education)** and **SDG 5 (Gender Equality)**.

*(This repository was originally started as "Ophelia", an offline-first AI safety companion. The project has since been reshaped into GirlMentor, an education platform.)*

---

## 1. The Problem

Many learners make high-impact decisions, such as subject choices, degree or TVET options and bursary applications, without clear guidance. Learners from under-resourced schools often have the least access to career counselling, mentors and information about funding like NSFAS and bursaries.

## 2. The Solution

GirlMentor is a web app that guides a learner from "where am I now?" to "what should I do next?":

1. She builds a profile (stage, level, location, subjects and marks, interests).
2. The app generates personalised pathways and routes based on that profile.
3. She can explore "what if" scenarios to see how different choices change her options.
4. She is matched with relevant opportunities and can get help from AI guidance and human mentors.

## 3. Features

**Profile builder**
- Stage: High School, University, TVET College, Graduate, Self-taught, Job Seeker
- Grade / year / level and qualification
- Country and city / town search
- Subject selection with a mark slider per subject (Mathematics, Physical Sciences, Life Sciences, Accounting, Business Studies, Economics, Information Technology, Computer Applications Technology)
- Interests (for example Technology, Cybersecurity, Engineering, Business, Entrepreneurship)

**Guidance and planning**
- Personalised pathway and route recommendations
- "What if" toggles to explore how different choices change the outcome
- Opportunity matching, with a short reason shown for each match
- AI guidance with an offline guidance fallback
- Localised NSFAS, TVET and bursary guidance

**People and impact**
- "Ask a Sister" mentor profiles and matching
- Sponsor / NPO dashboard with impact metrics for corporate CSI teams
- Architecture screen explaining how the system fits together

**Demo mode**
- "Demo as Amahle" loads a ready-made learner persona so the full flow can be shown without filling in the form.

## 4. Plans

| Plan | Price | What's included |
|---|---|---|
| Free | R0 | Basic AI guidance, subject selection help, basic quiz generation, public opportunities, offline guidance fallback |
| Premium | R99/month (annual option) | Custom study plans, AI business coaching, unlimited interview prep, priority matching with human mentors and tutors, advanced AI capabilities, localised NSFAS and bursary guidance. 7-day free trial |
| Sponsor / NPO | Custom | Sponsor learners from underserved schools, fund "Ask a Sister" mentors, track NSFAS / TVET / bursary outcomes, corporate CSI impact dashboard, early talent pipeline visibility |

## 5. Tech Stack

- **Front end:** HTML, CSS and JavaScript in a single page (`index.html`), no build step
- **Fonts:** Inter and Playfair Display (Google Fonts)
- **AI / ML:** TensorFlow.js (`@tensorflow/tfjs`) and the speech-commands model (`@tensorflow-models/speech-commands`) are declared dependencies. **[Describe what they are used for in the app, or remove them from `package.json` if they are no longer used.]**

## 6. Getting Started

```bash
# clone the repository
git clone https://github.com/Mapaseka-Moloi/Ophelia.git
cd Ophelia

# install dependencies
npm install

# run locally (any static server works)
npx serve .
```

Then open the local address shown in the terminal. You can also open `index.html` directly in a browser.

**Try it quickly:** on the landing screen, click **Demo as Amahle** to load a sample learner.

## 7. Project Structure

```
.
├── index.html          # the app: screens, styles and logic
├── package.json        # dependencies
├── package-lock.json
├── DOCUMENTATION.md    # extended documentation
└── README.md
```

## 8. Roadmap

- [ ] Replace placeholder guidance with live, sourced bursary and opportunity data
- [ ] Real mentor sign-up and matching
- [ ] Offline-first support so guidance still works without a connection
- [ ] User accounts and saved pathways
- [ ] Pilot with a school or NPO partner
- [ ] Validate recommendations with learners and counsellors

*(Edit this list to match what is actually built and what is next.)*

## 9. Further Reading

See [`DOCUMENTATION.md`](DOCUMENTATION.md) for extended documentation. Note that it may still describe the original safety concept and may need updating.

## 10. Author

Built by Mapaseka Moloi ([@Mapaseka-Moloi](https://github.com/Mapaseka-Moloi)) as part of a hackathon team.