import './styles/main.scss';
import { initTheme, toggleTheme } from './theme.js';
import { createRouter } from './router.js';
import { add, multiply, fibonacci, isEven } from './math.js';
import { reverse, isPalindrome, charFrequency, spongebobCase } from './strings.js';
import { shuffle, flatten, unique, groupBy } from './arrays.js';
import { API_CONFIG, getInfos, getLaravelInfo, getPhpInfo, getRuntimeInfo, getPackages, registerUser, loginUser } from './api.js';

initTheme();

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
    const href = link.getAttribute('href');
    // Match /api for both /api and /api/:tab routes
    const isActive = href === path || (href === '/api' && path.startsWith('/api'));
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
    <div class="home-intro">
      <h2 class="home-intro__title">Overview</h2>
      <p class="home-intro__text">
        This project provides a <strong>professional frontend baseline</strong> built with <strong>Vite</strong>, <strong>modular vanilla JavaScript</strong>, and <strong>responsive CSS</strong>.
        It highlights implementation standards for:
      </p>
      <ul class="home-intro__list">
        <li><strong>Client-side routing</strong> — efficient single-page navigation with explicit route handling</li>
        <li><strong>Modular architecture</strong> — clear separation between UI rendering, domain utilities, and adapters</li>
        <li><strong>Backend integration</strong> — reliable communication with a Laravel API layer</li>
        <li><strong>Theme management</strong> — persistent user preferences via localStorage</li>
        <li><strong>Testing discipline</strong> — focused unit tests for pure functions and shared utilities</li>
      </ul>
    </div>

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
      <a href="/api" data-router-link class="module-card">
        <span class="module-card__icon">{&thinsp;}</span>
        <div class="module-card__name">API</div>
        <div class="module-card__count">5 endpoints</div>
        <div class="module-card__fn">
          <code>infos</code> <code>laravel</code> <code>php</code> <code>runtime</code> <code>packages</code>
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
        <div class="stat__value">∞</div>
        <div class="stat__label">Possibilities</div>
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
        <button class="btn btn--primary" data-run="${name}">Run</button>
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
      <input class="demo-input u-flex-1" data-input="rev-str" placeholder="text" value="useless machine" />
    `, 'reverse')}

    ${demoBlock('isPalindrome', '(str) => boolean', `
      <input class="demo-input u-flex-1" data-input="pal-str" placeholder="text" value="A man, a plan, a canal: Panama" />
    `, 'isPalindrome')}

    ${demoBlock('charFrequency', '(str) => {char: count}', `
      <input class="demo-input u-flex-1" data-input="freq-str" placeholder="text" value="banana" />
    `, 'charFrequency')}

    ${demoBlock('spongebobCase', '(str) => string', `
      <input class="demo-input u-flex-1" data-input="sponge-str" placeholder="text" value="this is very useful" />
    `, 'spongebobCase')}
  `;
}

function renderArrays() {
  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">Arrays</h2>
    <p class="page-desc">Reinventing wheels, one function at a time.</p>

    ${demoBlock('shuffle', '(arr, seed?) => array  [Fisher-Yates]', `
      <input class="demo-input u-flex-1" data-input="shuf-arr" placeholder="array" value="[1,2,3,4,5,6,7,8]" />
      <input class="demo-input demo-input--narrow" data-input="shuf-seed" placeholder="seed" value="42" />
    `, 'shuffle')}

    ${demoBlock('flatten', '(arr) => array', `
      <input class="demo-input u-flex-1" data-input="flat-arr" placeholder="array" value="[1,[2,3],[4,[5]],6]" />
    `, 'flatten')}

    ${demoBlock('unique', '(arr) => array', `
      <input class="demo-input u-flex-1" data-input="uniq-arr" placeholder="array" value="[3,1,4,1,5,9,2,6,5,3]" />
    `, 'unique')}

    ${demoBlock('groupBy', '(arr, keyFn) => {key: items}', `
      <input class="demo-input u-flex-1" data-input="group-arr" placeholder="items (JSON)" value='[{"t":"a","v":1},{"t":"b","v":2},{"t":"a","v":3}]' />
    `, 'groupBy')}
  `;
}

function apiBlock(name, endpoint) {
  return `
    <div class="api-section">
      <div class="api-section__header">
        <span class="api-section__name">${name}</span>
        <span class="api-section__endpoint">GET ${endpoint}</span>
      </div>
      <div class="api-section__body">
        <button class="btn btn--primary" data-api="${name}">Fetch</button>
        <div class="api-result api-result--empty" data-api-result="${name}">click fetch&hellip;</div>
      </div>
    </div>
  `;
}

function renderApiConfig() {
  const { baseUrl, envKey, endpoints } = API_CONFIG;

  return `
    <section class="api-config">
      <h3 class="api-config__title">API Configuration</h3>
      <p class="api-config__desc">Current frontend API client settings and resolved endpoint paths.</p>
      <div class="api-config__grid">
        <div class="api-config__item">
          <span class="api-config__label">Base URL</span>
          <code class="api-config__value">${esc(baseUrl)}</code>
        </div>
        <div class="api-config__item">
          <span class="api-config__label">Environment Override</span>
          <code class="api-config__value">${esc(envKey)}</code>
        </div>
      </div>
      <ul class="api-config__list">
        <li><code>infos</code> → <code>${esc(`${baseUrl}${endpoints.infos}`)}</code></li>
        <li><code>laravel</code> → <code>${esc(`${baseUrl}${endpoints.laravel}`)}</code></li>
        <li><code>php</code> → <code>${esc(`${baseUrl}${endpoints.php}`)}</code></li>
        <li><code>runtime</code> → <code>${esc(`${baseUrl}${endpoints.runtime}`)}</code></li>
        <li><code>packages</code> → <code>${esc(`${baseUrl}${endpoints.packages}`)}</code></li>
      </ul>
    </section>
  `;
}

function renderApi({ tab = 'combined' } = {}) {
  const tabs = ['combined', 'framework', 'php', 'runtime', 'packages'];
  const activeTab = tabs.includes(tab) ? tab : 'combined';

  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">API</h2>
    <p class="page-desc">Live data from the Laravel backend. Surprisingly real.</p>
    ${renderApiConfig()}

    <nav class="api-tabs" data-api-tabs>
      <a href="/api/combined" data-router-link class="api-tabs__tab" data-active="${activeTab === 'combined'}">Combined</a>
      <a href="/api/framework" data-router-link class="api-tabs__tab" data-active="${activeTab === 'framework'}">Framework</a>
      <a href="/api/php" data-router-link class="api-tabs__tab" data-active="${activeTab === 'php'}">PHP</a>
      <a href="/api/runtime" data-router-link class="api-tabs__tab" data-active="${activeTab === 'runtime'}">Runtime</a>
      <a href="/api/packages" data-router-link class="api-tabs__tab" data-active="${activeTab === 'packages'}">Packages</a>
    </nav>

    <div class="api-tab-content" data-api-content="combined" data-active="${activeTab === 'combined'}">
      <div class="api-category">
        <h3 class="api-category__title">Combined Diagnostics</h3>
        <p class="api-category__desc">Aggregate information across the entire stack</p>
        ${apiBlock('infos', '/api/infos')}
      </div>
    </div>

    <div class="api-tab-content" data-api-content="framework" data-active="${activeTab === 'framework'}">
      <div class="api-category">
        <h3 class="api-category__title">Framework Information</h3>
        <p class="api-category__desc">Laravel version, environment, configuration</p>
        ${apiBlock('laravel', '/api/infos/laravel')}
      </div>
    </div>

    <div class="api-tab-content" data-api-content="php" data-active="${activeTab === 'php'}">
      <div class="api-category">
        <h3 class="api-category__title">PHP Runtime</h3>
        <p class="api-category__desc">PHP version, SAPI, extensions, and capabilities</p>
        ${apiBlock('php', '/api/infos/php')}
      </div>
    </div>

    <div class="api-tab-content" data-api-content="runtime" data-active="${activeTab === 'runtime'}">
      <div class="api-category">
        <h3 class="api-category__title">Application Runtime</h3>
        <p class="api-category__desc">Server timestamps, timezone, and app metadata</p>
        ${apiBlock('runtime', '/api/infos/runtime')}
      </div>
    </div>

    <div class="api-tab-content" data-api-content="packages" data-active="${activeTab === 'packages'}">
      <div class="api-category">
        <h3 class="api-category__title">Dependencies</h3>
        <p class="api-category__desc">Installed Composer packages and versions</p>
        ${apiBlock('packages', '/api/infos/packages')}
      </div>
    </div>
  `;
}

/* ─── AUTH PAGES ─── */

function renderRegister() {
  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">Register</h2>
    <p class="page-desc">Create an account to get a Sanctum API token.</p>

    <div class="auth-form">
      <input class="demo-input u-full-width" data-input="reg-name" type="text" placeholder="Name" />
      <input class="demo-input u-full-width" data-input="reg-email" type="email" placeholder="Email" />
      <input class="demo-input u-full-width" data-input="reg-password" type="password" placeholder="Password (min 8 chars)" />
      <input class="demo-input u-full-width" data-input="reg-password-confirm" type="password" placeholder="Confirm password" />
      <button class="btn btn--primary u-full-width" data-auth="register">Register</button>
      <div class="auth-result" data-auth-result="register"></div>
      <p class="auth-link">Already have an account? <a href="/login" data-router-link>Login</a></p>
    </div>
  `;
}

function renderLogin() {
  return `
    <a href="/" data-router-link class="back-link">&larr; back</a>
    <h2 class="page-title">Login</h2>
    <p class="page-desc">Authenticate and receive a Sanctum API token.</p>

    <div class="auth-form">
      <input class="demo-input u-full-width" data-input="login-email" type="email" placeholder="Email" />
      <input class="demo-input u-full-width" data-input="login-password" type="password" placeholder="Password" />
      <button class="btn btn--primary u-full-width" data-auth="login">Login</button>
      <div class="auth-result" data-auth-result="login"></div>
      <p class="auth-link">No account? <a href="/register" data-router-link>Register</a></p>
    </div>
  `;
}

async function handleAuth(action) {
  bumpOps();
  const el = app.querySelector(`[data-auth-result="${action}"]`);

  try {
    let result;
    if (action === 'register') {
      result = await registerUser({
        name: val('reg-name'),
        email: val('reg-email'),
        password: val('reg-password'),
        password_confirmation: val('reg-password-confirm'),
      });
    } else {
      result = await loginUser({
        email: val('login-email'),
        password: val('login-password'),
      });
    }

    if (el) {
      el.className = 'auth-result auth-result--success';
      el.innerHTML = `
        <div class="auth-result__user">${esc(result.user.name)} (${esc(result.user.email)})</div>
        <div class="auth-result__token-label">Token:</div>
        <code class="auth-result__token">${esc(result.token)}</code>
      `;
    }
  } catch (err) {
    if (el) {
      const errors = err.errors || {};
      const details = Object.values(errors).flat().map((e) => esc(e)).join('<br>');
      el.className = 'auth-result auth-result--error';
      el.innerHTML = `<span class="auth-result__message">${esc(err.message)}</span>${details ? `<div class="auth-result__details">${details}</div>` : ''}`;
    }
  }
}

/* ─── API HANDLERS ─── */

const API_HANDLERS = {
  infos: getInfos,
  laravel: getLaravelInfo,
  php: getPhpInfo,
  runtime: getRuntimeInfo,
  packages: getPackages,
};

async function handleApi(name) {
  bumpOps();
  const handler = API_HANDLERS[name];
  if (!handler) return;

  const el = app.querySelector(`[data-api-result="${name}"]`);
  if (el) {
    el.classList.remove('api-result--empty');
    el.innerHTML = '<span class="api-result__loading">fetching&hellip;</span>';
  }

  try {
    const data = await handler();
    if (el) {
      el.innerHTML = `<pre class="api-result__json"><code>${esc(JSON.stringify(data, null, 2))}</code></pre>`;
    }
  } catch (err) {
    if (el) {
      el.innerHTML = `<span class="api-result__error">${esc(err.message)}</span>`;
    }
  }
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
      el.innerHTML = `<span class="demo-result__error">Error: ${esc(err.message)}</span>`;
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
    { path: '/register', render: renderRegister },
    { path: '/login', render: renderLogin },
    { path: '/api/:tab', render: ({ params }) => renderApi({ tab: params.tab }) },
    { path: '/api', render: () => renderApi() },
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

/* ─── DELEGATED CLICK HANDLERS ─── */

app.addEventListener('click', (event) => {
  const runBtn = event.target.closest('[data-run]');
  if (runBtn) {
    handleRun(runBtn.dataset.run);
    return;
  }

  const apiBtn = event.target.closest('[data-api]');
  if (apiBtn) {
    handleApi(apiBtn.dataset.api);
    return;
  }

  const authBtn = event.target.closest('[data-auth]');
  if (authBtn) {
    handleAuth(authBtn.dataset.auth);
  }
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-theme-toggle]')) {
    toggleTheme();
  }
});
