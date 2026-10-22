// Usage: BROWSE_BIN=/path/to/gstack/browse node scripts/validate-ui.mjs [preview URL]
// Uses the shared gstack browser; no additional browser installation is needed.
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const browser = process.env.BROWSE_BIN;
assert(browser, 'Set BROWSE_BIN to the gstack browse executable');
const url = process.argv[2] || 'http://127.0.0.1:4173/Portfolio/';
const run = (...args) => execFileSync(browser, args, { encoding: 'utf8', cwd: '/private/tmp', timeout: 30000 }).trim();
const evaluate = (code) => JSON.parse(run('js', `JSON.stringify(${code})`));
const sizes = [[320,568],[360,800],[375,812],[390,844],[430,932],[600,800],[601,800],[719,900],[720,1024],[768,1024],[900,1200],[959,900],[960,900],[1024,768],[1280,800],[1440,900],[1920,1080],[844,390]];
run('goto', url);
run('console', '--clear');
const count = evaluate('document.querySelectorAll(".card-toggle").length');
assert.equal(count, 20, 'Expected 6 experience and 14 project cards');
for (const [width, height] of sizes) {
  run('viewport', `${width}x${height}`);
  for (const theme of ['dark', 'light']) {
    if (evaluate('document.documentElement.dataset.theme') !== theme) run('click', '.theme-toggle');
    assert.equal(evaluate('document.documentElement.dataset.theme'), theme);
    assert.equal(evaluate('localStorage.getItem("theme")'), theme);
    if (width < 960) {
      run('click', '.menu-button');
      assert.equal(evaluate('document.querySelector(".menu-button").getAttribute("aria-expanded")'), 'true');
      run('press', 'Escape');
      assert.equal(evaluate('document.querySelector(".menu-button").getAttribute("aria-expanded")'), 'false');
    }
    for (const section of ['experience','projects','achievements','education','skills','contact']) {
      if (width < 960) run('click', '.menu-button');
      run('click', `${width < 960 ? '.menu-dropdown' : '.nav-list'} a[href="#${section}"]`);
      const position = evaluate(`(() => {const s=document.getElementById('${section}').getBoundingClientRect();const h=document.querySelector('.site-header').getBoundingClientRect();return {sectionTop:s.top,headerBottom:h.bottom,hash:location.hash,menuOpen:document.querySelector('.menu-button').getAttribute('aria-expanded')};})()`);
      assert.equal(position.hash, `#${section}`);
      assert(position.sectionTop >= position.headerBottom - 1, `Header hides ${section}: ${JSON.stringify(position)}`);
      assert.equal(position.menuOpen, 'false');
    }
    // Open every card through a real click, verify content is visible and has no internal clipping.
    for (let i = 0; i < count; i++) {
      const selector = `${i < 6 ? '#experience' : '#projects'} article:nth-child(${i < 6 ? i + 1 : i - 5}) .card-toggle`;
      run('click', selector);
      const state = evaluate(`(() => {const b=document.querySelectorAll('.card-toggle')[${i}];const d=document.getElementById(b.getAttribute('aria-controls'));return {expanded:b.getAttribute('aria-expanded'),visible:!d.hidden && d.getBoundingClientRect().height>0,clipped:d.scrollHeight>d.clientHeight+1,overflow:document.documentElement.scrollWidth>innerWidth};})()`);
      assert.equal(state.expanded, 'true');
      assert(state.visible && !state.clipped && !state.overflow, `Card ${i} at ${width}/${theme}: ${JSON.stringify(state)}`);
      run('click', selector);
      assert(evaluate(`document.querySelectorAll('.card-details')[${i}].hidden`));
    }
    const layout = evaluate(`(() => {const visible=e=>!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length);return {overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('.card-overview,.card-header,.hero-title,.contact-link')].filter(visible).filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.className),smallTargets:[...document.querySelectorAll('button,.hero-cta a,.contact-link,.nav-list a')].filter(visible).filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent),images:[...document.images].filter(e=>e.complete&&!e.naturalWidth).map(e=>e.src),title:document.querySelector('#experience .card-subtitle').textContent,milestone:document.querySelector('.launch-milestone').textContent};})()`);
    assert(!layout.overflow && !layout.clipped.length && !layout.smallTargets.length && !layout.images.length, `${width}/${theme}: ${JSON.stringify(layout)}`);
    assert.equal(layout.title, 'Product Engineer');
    assert.match(layout.milestone, /App Store.*1,000\+ users/);
    console.log(`PASS ${width}x${height} ${theme}: navigation, 20 disclosures, layout, touch targets, content`);
  }
}
// Keyboard activation uses the same real button as pointer/touch input.
run('js', 'document.querySelector(".card-toggle").focus()');
run('press', 'Enter');
assert.equal(evaluate('document.querySelector(".card-toggle").getAttribute("aria-expanded")'), 'true');
run('press', 'Space');
assert.equal(evaluate('document.querySelector(".card-toggle").getAttribute("aria-expanded")'), 'false');
const consoleOutput = run('console', '--errors');
assert(consoleOutput.includes('(no console errors)'), consoleOutput);
run('reload');
assert.equal(evaluate('document.documentElement.dataset.theme'), 'light', 'Theme survives reload');
console.log(`PASS: ${sizes.length} viewport sizes × 2 themes, keyboard activation, theme persistence, no browser errors.`);
