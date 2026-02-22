import { createRouter } from './router.js';

const app = document.querySelector('#app');
const nav = document.querySelector('[data-nav]');

function setActiveLink(path) {
  const links = nav.querySelectorAll('a[data-router-link]');

  for (const link of links) {
    const isActive = link.getAttribute('href') === path;
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  }
}

const router = createRouter({
  root: app,
  routes: [
    {
      path: '/',
      render: () => `
        <section class="page page--home">
          <h1>Router Demo: Home</h1>
          <p>
            Ceci est la premiere page de demonstration. Clique sur le menu pour
            verifier la navigation client-side sans rechargement.
          </p>
          <button class="demo-button" data-go-about>Aller vers About</button>
        </section>
      `,
    },
    {
      path: '/about',
      render: () => `
        <section class="page page--about">
          <h1>Router Demo: About</h1>
          <p>
            Deuxieme page de demonstration. Le router est reutilisable et gere
            aussi les routes dynamiques, par exemple <code>/post/:id</code>.
          </p>
          <button class="demo-button" data-go-home>Retour Home</button>
        </section>
      `,
    },
  ],
  notFound: ({ path }) => `
    <section class="page page--not-found">
      <h1>404</h1>
      <p>La route <code>${path}</code> n'existe pas.</p>
      <a class="inline-link" href="/" data-router-link>Retour a Home</a>
    </section>
  `,
  onRouteChange: ({ path }) => {
    setActiveLink(path);
  },
});

router.start();

app.addEventListener('click', (event) => {
  const aboutButton = event.target.closest('[data-go-about]');
  if (aboutButton) {
    router.navigate('/about');
    return;
  }

  const homeButton = event.target.closest('[data-go-home]');
  if (homeButton) {
    router.navigate('/');
  }
});
