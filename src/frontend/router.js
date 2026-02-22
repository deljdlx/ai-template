function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizePath(path) {
  if (!path) {
    return '/';
  }

  const withoutQuery = path.split(/[?#]/u)[0] || '/';
  const withLeadingSlash = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;

  if (withLeadingSlash !== '/' && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
}

export function createRouteMatcher(pattern) {
  const normalizedPattern = normalizePath(pattern);

  if (normalizedPattern === '/') {
    return {
      pattern: normalizedPattern,
      match(path) {
        return normalizePath(path) === '/' ? {} : null;
      },
    };
  }

  const paramNames = [];
  const segments = normalizedPattern
    .slice(1)
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }

      return escapeForRegExp(segment);
    });

  const matcher = new RegExp(`^/${segments.join('/')}$`, 'u');

  return {
    pattern: normalizedPattern,
    match(path) {
      const normalizedPath = normalizePath(path);
      const groups = normalizedPath.match(matcher);

      if (!groups) {
        return null;
      }

      return paramNames.reduce((params, name, index) => {
        params[name] = decodeURIComponent(groups[index + 1]);
        return params;
      }, {});
    },
  };
}

export function findMatchingRoute(path, routes) {
  const normalizedPath = normalizePath(path);

  for (const route of routes) {
    const params = route.matcher.match(normalizedPath);
    if (params) {
      return { route, params };
    }
  }

  return null;
}

export function createRouter({
  routes,
  root,
  notFound = ({ path }) => `<h1>404</h1><p>No route for ${path}</p>`,
  linkSelector = 'a[data-router-link]',
  onRouteChange,
}) {
  if (!root) {
    throw new Error('createRouter requires a root element.');
  }

  const configuredRoutes = routes.map((route) => ({
    ...route,
    matcher: createRouteMatcher(route.path),
  }));

  const state = {
    started: false,
    currentPath: null,
  };

  function render(path) {
    const match = findMatchingRoute(path, configuredRoutes);
    const resolvedPath = normalizePath(path);

    const content = match
      ? match.route.render({
          path: resolvedPath,
          params: match.params,
          navigate,
        })
      : notFound({
          path: resolvedPath,
          navigate,
        });

    if (typeof content === 'string') {
      root.innerHTML = content;
    } else if (content instanceof Node) {
      root.replaceChildren(content);
    } else {
      root.textContent = '';
    }

    state.currentPath = resolvedPath;

    if (typeof onRouteChange === 'function') {
      onRouteChange({
        path: resolvedPath,
        route: match ? match.route : null,
        params: match ? match.params : {},
      });
    }
  }

  function navigate(path, { replace = false, navigationState = null } = {}) {
    const normalizedPath = normalizePath(path);
    const method = replace ? 'replaceState' : 'pushState';

    window.history[method](navigationState, '', normalizedPath);
    render(normalizedPath);
  }

  function handleDocumentClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const anchor = event.target.closest(linkSelector);
    if (!anchor) {
      return;
    }

    if (anchor.target && anchor.target !== '_self') {
      return;
    }

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  function handlePopState() {
    render(window.location.pathname);
  }

  function start() {
    if (state.started) {
      return;
    }

    state.started = true;
    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('popstate', handlePopState);
    navigate(window.location.pathname, { replace: true });
  }

  function destroy() {
    if (!state.started) {
      return;
    }

    state.started = false;
    document.removeEventListener('click', handleDocumentClick);
    window.removeEventListener('popstate', handlePopState);
  }

  return {
    start,
    destroy,
    navigate,
    getCurrentPath() {
      return state.currentPath;
    },
  };
}
