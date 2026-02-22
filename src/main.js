import { createRouter } from './router.js';
import { add, multiply, fibonacci, isEven } from './math.js';
import { reverse, isPalindrome, charFrequency, spongebobCase } from './strings.js';
import { shuffle, flatten, unique, groupBy } from './arrays.js';

const app = document.querySelector('#app');
const nav = document.querySelector('[data-nav]');
const opsEl = document.querySelector('[data-ops]');
let opsCount = 0;

function bumpOps() {
  opsCount++;
  opsEl.textContent = opsCount;
}

function setActiveLink(path) {
  for (const link of nav.querySelectorAll('a[data-router-link]')) {
    const isActive = link.getAttribute('href') === path;
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  }
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ─── PAGE RENDERERS ─── */

function renderHome() {
  return `
    <div class="home-grid">
      <a href="/math" data-router-link class="module-card">
        <span class="module-card__icon">&#x1D453;</span>
        <div class="module-card__name">Math</div>
        <div class="module-card__count">4 functions</div>
        <div class="module-card__fn">
          <code>add</code> <code>multiply</code> <code>fibonacci</code> <code>isEven</code>
        </div>
      </a>
      <a href="/strings" data-router-link class="module-card">
        <span class="module-card__icon">&ldquo;ab&rdquo;</span>
        <div class="module-card__name">Strings</div>
        <div class="module-card__count">4 functions</div>
        <div class="module-card__fn">
          <code>reverse</code> <code>isPalindrome</code> <code>charFrequency</code> <code>spongebobCase</code>
        </div>
      </a>
      <a href="/arrays" data-router-link class="module-card">
        <span class="module-card__icon">[&thinsp;]</span>
        <div class="module-card__name">Arrays</div>
        <div class="module-card__count">4 functions</div>
        <div class="module-card__fn">
          <code>shuffle</code> <code>flatten</code> <code>unique</code> <code>groupBy</code>
        </div>
      </a>
    </div>
    <div class="home-stats">
      <div class="stat">
        <div class="stat__value">12</div>
        <div class="stat__label">Functions</div>
      </div>
      <div class="stat">
        <div class="stat__value">37</div>
        <div class="stat__label">Tests</div>
      </div>
      <div class="stat">
        <div class="stat__value">0</div>
        <div class="stat__label">Useful ones</div>
      </div>
    </div>
  `;
}

function demoBlock(name, sig, inputsHtml, resultId) {
  return `
    <div class="demo-section">
      <div class="demo-header">
        <span class="demo-header__name">${name}</span>
        <span class="demo-header__sig">${esc(sig)}</span>
      </div>
      <div class="demo-body">
        ${inputsHtml}
        <button class="demo-run" data-run="${name}">Run</button>
        <div class="demo-result demo-result--empty" data-result="${resultId}">click run&hellip;</div>
      </div>
    </div>
  `;
}

function renderMath() {
  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">Math</h2>
    <p class="page-desc">Technically correct. Profoundly unnecessary.</p>

    ${demoBlock('add', '(a, b) => number', `
      <input class="demo-input" data-input="add-a" placeholder="a" value="7" />
      <input class="demo-input" data-input="add-b" placeholder="b" value="35" />
    `, 'add')}

    ${demoBlock('multiply', '(a, b) => number  [repeated addition]', `
      <input class="demo-input" data-input="mul-a" placeholder="a" value="6" />
      <input class="demo-input" data-input="mul-b" placeholder="b" value="9" />
    `, 'multiply')}

    ${demoBlock('fibonacci', '(n) => number  [naive recursive]', `
      <input class="demo-input" data-input="fib-n" placeholder="n" value="10" />
    `, 'fibonacci')}

    ${demoBlock('isEven', '(n) => boolean  [subtract 2 loop]', `
      <input class="demo-input" data-input="even-n" placeholder="n" value="42" />
    `, 'isEven')}
  `;
}

function renderStrings() {
  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">Strings</h2>
    <p class="page-desc">Over-engineered solutions to problems nobody has.</p>

    ${demoBlock('reverse', '(str) => string', `
      <input class="demo-input" data-input="rev-str" placeholder="text" value="useless machine" style="flex:1" />
    `, 'reverse')}

    ${demoBlock('isPalindrome', '(str) => boolean', `
      <input class="demo-input" data-input="pal-str" placeholder="text" value="A man, a plan, a canal: Panama" style="flex:1" />
    `, 'isPalindrome')}

    ${demoBlock('charFrequency', '(str) => {char: count}', `
      <input class="demo-input" data-input="freq-str" placeholder="text" value="banana" style="flex:1" />
    `, 'charFrequency')}

    ${demoBlock('spongebobCase', '(str) => string', `
      <input class="demo-input" data-input="sponge-str" placeholder="text" value="this is very useful" style="flex:1" />
    `, 'spongebobCase')}
  `;
}

function renderArrays() {
  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">Arrays</h2>
    <p class="page-desc">Reinventing wheels, one function at a time.</p>

    ${demoBlock('shuffle', '(arr, seed?) => array  [Fisher-Yates]', `
      <input class="demo-input" data-input="shuf-arr" placeholder="array" value="[1,2,3,4,5,6,7,8]" style="flex:1" />
      <input class="demo-input" data-input="shuf-seed" placeholder="seed" value="42" style="width:80px" />
    `, 'shuffle')}

    ${demoBlock('flatten', '(arr) => array', `
      <input class="demo-input" data-input="flat-arr" placeholder="array" value="[1,[2,3],[4,[5]],6]" style="flex:1" />
    `, 'flatten')}

    ${demoBlock('unique', '(arr) => array', `
      <input class="demo-input" data-input="uniq-arr" placeholder="array" value="[3,1,4,1,5,9,2,6,5,3]" style="flex:1" />
    `, 'unique')}

    ${demoBlock('groupBy', '(arr, keyFn) => {key: items}', `
      <input class="demo-input" data-input="group-arr" placeholder="items (JSON)" value='[{"t":"a","v":1},{"t":"b","v":2},{"t":"a","v":3}]' style="flex:1" />
    `, 'groupBy')}
  `;
}

/* ─── DEMO HANDLERS ─── */

function val(name) {
  const el = app.querySelector(`[data-input="${name}"]`);
  return el ? el.value : '';
}

function showResult(id, html) {
  const el = app.querySelector(`[data-result="${id}"]`);
  if (el) {
    el.classList.remove('demo-result--empty');
    el.innerHTML = `<span class="label">&raquo;</span><code>${html}</code>`;
  }
}

function handleRun(name) {
  bumpOps();
  try {
    switch (name) {
      case 'add':
        showResult('add', esc(String(add(Number(val('add-a')), Number(val('add-b'))))));
        break;
      case 'multiply':
        showResult('multiply', esc(String(multiply(Number(val('mul-a')), Number(val('mul-b'))))));
        break;
      case 'fibonacci':
        showResult('fibonacci', esc(String(fibonacci(Number(val('fib-n'))))));
        break;
      case 'isEven':
        showResult('isEven', esc(String(isEven(Number(val('even-n'))))));
        break;
      case 'reverse':
        showResult('reverse', esc(reverse(val('rev-str'))));
        break;
      case 'isPalindrome':
        showResult('isPalindrome', esc(String(isPalindrome(val('pal-str')))));
        break;
      case 'charFrequency':
        showResult('charFrequency', esc(JSON.stringify(charFrequency(val('freq-str')))));
        break;
      case 'spongebobCase':
        showResult('spongebobCase', esc(spongebobCase(val('sponge-str'))));
        break;
      case 'shuffle': {
        const arr = JSON.parse(val('shuf-arr'));
        const seed = val('shuf-seed') ? Number(val('shuf-seed')) : undefined;
        showResult('shuffle', esc(JSON.stringify(shuffle(arr, seed))));
        break;
      }
      case 'flatten':
        showResult('flatten', esc(JSON.stringify(flatten(JSON.parse(val('flat-arr'))))));
        break;
      case 'unique':
        showResult('unique', esc(JSON.stringify(unique(JSON.parse(val('uniq-arr'))))));
        break;
      case 'groupBy': {
        const items = JSON.parse(val('group-arr'));
        showResult('groupBy', esc(JSON.stringify(groupBy(items, (x) => x.t))));
        break;
      }
      default:
        break;
    }
  } catch (err) {
    const el = app.querySelector(`[data-result="${name}"]`);
    if (el) {
      el.classList.remove('demo-result--empty');
      el.innerHTML = `<span style="color:var(--red)">Error: ${esc(err.message)}</span>`;
    }
  }
}

/* ─── ROUTER ─── */

const router = createRouter({
  root: app,
  routes: [
    { path: '/', render: renderHome },
    { path: '/math', render: renderMath },
    { path: '/strings', render: renderStrings },
    { path: '/arrays', render: renderArrays },
  ],
  notFound: ({ path }) => `
    <div class="not-found">
      <div class="not-found__code">404</div>
      <p class="not-found__msg">Route <code>${esc(path)}</code> does not exist.</p>
      <a href="/" data-router-link class="back-link">&larr; back to home</a>
    </div>
  `,
  onRouteChange: ({ path }) => {
    setActiveLink(path);
    app.style.animation = 'none';
    app.offsetHeight;
    app.style.animation = '';
  },
});

router.start();

/* ─── DELEGATED CLICK HANDLER ─── */

app.addEventListener('click', (event) => {
  const runBtn = event.target.closest('[data-run]');
  if (runBtn) {
    handleRun(runBtn.dataset.run);
  }
});
