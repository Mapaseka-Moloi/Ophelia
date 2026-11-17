// Smoke test: loads index.html in jsdom, runs the app's scripts, and exercises
// the main user flows (demo profile, path generation, what-if, AI coach, screens).
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e.stack || e.message)));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole: vc,
  url: 'http://localhost:4173/',
});
const { window } = dom;
const { document } = window;
// jsdom does not implement scrolling; that is a jsdom gap, not an app bug.
window.scrollTo = () => {};

// Evaluate in page scope so top-level const/let declarations are visible.
const evalInPage = code => window.eval(code);

function run(label, fn) {
  try {
    fn();
    console.log('ok   - ' + label);
  } catch (e) {
    errors.push(label + ': ' + (e.stack || e.message));
    console.log('FAIL - ' + label + ': ' + e.message);
  }
}

function expectContent(id, label) {
  const el = document.getElementById(id);
  if (!el) throw new Error(label + ' element #' + id + ' missing');
  if (!el.innerHTML.trim()) throw new Error(label + ' is empty (#' + id + ')');
}

window.addEventListener('load', () => {
  run('landing screen visible', () => {
    const el = document.getElementById('screen-landing');
    if (!el || el.classList.contains('hidden')) throw new Error('landing not shown');
  });

  run('demo profile loads (loadAmahle)', () => {
    evalInPage('loadAmahle()');
    const state = evalInPage('JSON.stringify({name: AppState.profile.name, subjects: (AppState.profile.subjects||[]).length, stage: AppState.profile.stage})');
    const s = JSON.parse(state);
    if (!s.name) throw new Error('profile has no name');
    if (!s.subjects) throw new Error('profile has no subjects');
    console.log('       demo: ' + s.name + ' / ' + s.stage + ' / ' + s.subjects + ' subjects');
  });

  run('dashboard renders', () => {
    evalInPage('renderAll()');
    expectContent('routes', 'routes');
    expectContent('pathway', 'pathway');
    expectContent('opportunities', 'opportunities');
    expectContent('mentor', 'mentors');
    expectContent('impact-metrics', 'impact metrics');
    expectContent('profile-summary', 'profile summary');
  });

  run('what-if toggles change the path', () => {
    const before = evalInPage('(renderPathway(), document.getElementById("pathway").innerHTML)');
    evalInPage('toggleWhatIf("dropMaths"); renderAll()');
    const after = evalInPage('document.getElementById("pathway").innerHTML');
    if (before === after) throw new Error('dropping maths did not change the pathway');
    evalInPage('toggleWhatIf("dropMaths"); resetWhatIfChanges(); renderAll()');
    const restored = evalInPage('document.getElementById("pathway").innerHTML');
    if (restored !== before) throw new Error('reset did not restore the pathway');
  });

  run('AI coach answers', () => {
    evalInPage('document.getElementById("ai-question").value = "What can I study with maths?"; askAiCoach()');
    expectContent('ai-answer', 'AI answer');
    const hidden = document.getElementById('ai-answer').classList.contains('hidden');
    if (hidden) throw new Error('AI answer still hidden');
  });

  run('not-sure-yet goal gets exploratory routes', () => {
    const original = evalInPage('JSON.stringify(AppState.profile)');
    evalInPage('fillProfileToForm(Object.assign({}, AppState.profile, {goal: "Not sure yet"})); generatePath()');
    const routes = document.getElementById('routes').textContent;
    if (!/Shortlist 3 goals/.test(routes)) throw new Error('exploratory routes missing');
    const status = document.getElementById('impact-summary').textContent;
    if (!/Exploring/.test(status)) throw new Error('expected exploring status, got: ' + status);
    evalInPage('fillProfileToForm(' + original + '); generatePath()');
    const restored = evalInPage('AppState.profile.goal');
    if (restored === 'Not sure yet') throw new Error('original goal not restored');
  });

  run('impact metrics reflect real matches', () => {
    const vals = Array.from(document.querySelectorAll('#impact-metrics .metric-value')).map(el => parseInt(el.textContent, 10));
    if (vals.length !== 4 || vals.some(v => Number.isNaN(v))) throw new Error('metrics not numeric: ' + vals.join(','));
    const oppsShown = document.querySelectorAll('#opportunities .opportunity-card').length;
    if (oppsShown > 6) throw new Error('more than 6 opportunities shown');
    console.log('       metrics: ' + vals.join(' / '));
  });

  run('all screens navigate', () => {
    ['profile', 'dashboard', 'sponsor', 'architecture', 'landing'].forEach(s => {
      evalInPage('showScreen("' + s + '")');
      const el = document.getElementById('screen-' + s);
      if (!el || el.classList.contains('hidden')) throw new Error('screen ' + s + ' not shown');
    });
  });

  run('profile form round-trip', () => {
    evalInPage('showScreen("profile")');
    evalInPage('fillProfileToForm(AppState.profile)');
    const a = evalInPage('JSON.stringify(readProfileFromForm())');
    const b = evalInPage('JSON.stringify((fillProfileToForm(AppState.profile), readProfileFromForm()))');
    if (a !== b) throw new Error('form round-trip mismatch:\n' + a + '\n' + b);
  });

  run('plan/billing controls', () => {
    evalInPage('setBilling("annual"); setBilling("monthly"); chooseFreePlan(); startPremiumTrial(); updatePlanBadge()');
    if (!document.getElementById('plan-badge').textContent.trim()) throw new Error('plan badge empty');
  });

  run('country + city search', () => {
    document.getElementById('country').value = 'south';
    evalInPage('handleCountrySearch()');
    if (!document.getElementById('province-results').innerHTML.trim()) throw new Error('no country results');
    document.getElementById('city').value = 'joh';
    evalInPage('handleCitySearch()');
    if (!document.getElementById('city-results').innerHTML.trim()) throw new Error('no city results');
  });

  run('offline toggle', () => {
    evalInPage('toggleOfflineMode()');
    evalInPage('toggleOfflineMode()');
  });

  run('edit + reset', () => {
    evalInPage('editProfile(); resetDemo()');
    evalInPage('showScreen("landing")');
  });

  const realErrors = errors.filter(e => !/scrollTo/.test(e));
  console.log('\n' + (realErrors.length ? 'ERRORS:\n' + realErrors.join('\n---\n') : 'No runtime errors.'));
  process.exit(realErrors.length ? 1 : 0);
});
