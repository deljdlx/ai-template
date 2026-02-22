/**
 * Feature flags page module.
 * Keeps page-specific rendering and interactions out of main bootstrap.
 */
export function createFeatureFlagsPage({
  app,
  routeHref,
  esc,
  getInputValue,
  setInputValue,
  getFeatureFlags,
  createFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
}) {
  function render() {
    return `
      <a href="${routeHref('/')}" data-router-link class="back-link">&larr; back</a>
      <h2 class="page-title">Feature Flags</h2>
      <p class="page-desc">Create and manage Laravel Pennant flags (global scope).</p>
      <p class="flags-note">
        TODO: protect this page and API routes with auth/permissions before production use.
      </p>

      <div class="flags-form">
        <input class="demo-input u-flex-1" data-input="flag-name" type="text" placeholder="flag name (e.g. checkout.v2)" />
        <select class="demo-input demo-input--narrow" data-input="flag-enabled">
          <option value="true" selected>enabled</option>
          <option value="false">disabled</option>
        </select>
        <button class="btn btn--primary" data-flag-action="create">Create</button>
      </div>

      <div class="flags-feedback flags-feedback--empty" data-flags-feedback>no operation yet</div>
      <div class="flags-list" data-flags-list>
        <div class="api-result api-result--empty">loading feature flags&hellip;</div>
      </div>
    `;
  }

  function renderList(items) {
    if (!items.length) {
      return '<div class="api-result api-result--empty">no feature flags yet</div>';
    }

    return items
      .map((item) => `
        <div class="flags-item">
          <div class="flags-item__meta">
            <code class="flags-item__name">${esc(item.name)}</code>
            <span class="flags-item__state" data-enabled="${item.enabled}">
              ${item.enabled ? 'enabled' : 'disabled'}
            </span>
          </div>
          <div class="flags-item__actions">
            <button class="btn" data-flag-action="toggle" data-flag-name="${esc(item.name)}" data-flag-enabled="${item.enabled}">
              ${item.enabled ? 'Disable' : 'Enable'}
            </button>
            <button class="btn" data-flag-action="delete" data-flag-name="${esc(item.name)}">Delete</button>
          </div>
        </div>
      `)
      .join('');
  }

  function setFeedback(message, type = 'neutral') {
    const el = app.querySelector('[data-flags-feedback]');
    if (!el) {
      return;
    }

    el.className = `flags-feedback flags-feedback--${type}`;
    el.textContent = message;
  }

  async function refreshList() {
    const listEl = app.querySelector('[data-flags-list]');
    if (!listEl) {
      return;
    }

    listEl.innerHTML = '<div class="api-result api-result--empty">loading feature flags&hellip;</div>';

    try {
      const payload = await getFeatureFlags();
      listEl.innerHTML = renderList(payload.items || []);
    } catch (err) {
      listEl.innerHTML = `<div class="api-result"><span class="api-result__error">${esc(err.message)}</span></div>`;
    }
  }

  async function handleAction(action, button) {
    if (action === 'create') {
      const name = getInputValue('flag-name').trim();
      const enabled = getInputValue('flag-enabled') === 'true';

      if (!name) {
        setFeedback('name is required', 'error');
        return;
      }

      try {
        const result = await createFeatureFlag({ name, enabled });
        setFeedback(`saved ${result.name} (${result.enabled ? 'enabled' : 'disabled'})`, 'success');
        await refreshList();
        setInputValue('flag-name', '');
      } catch (err) {
        setFeedback(err.message, 'error');
      }

      return;
    }

    const name = button.dataset.flagName;
    if (!name) {
      return;
    }

    if (action === 'toggle') {
      const currentEnabled = button.dataset.flagEnabled === 'true';
      try {
        const result = await updateFeatureFlag(name, !currentEnabled);
        setFeedback(`updated ${result.name} (${result.enabled ? 'enabled' : 'disabled'})`, 'success');
        await refreshList();
      } catch (err) {
        setFeedback(err.message, 'error');
      }
      return;
    }

    if (action === 'delete') {
      try {
        await deleteFeatureFlag(name);
        setFeedback(`deleted ${name}`, 'success');
        await refreshList();
      } catch (err) {
        setFeedback(err.message, 'error');
      }
    }
  }

  async function onRouteChange(path) {
    if (!path.startsWith('/feature-flags')) {
      return;
    }

    await refreshList();
  }

  async function onClick(event) {
    const button = event.target.closest('[data-flag-action]');
    if (!button) {
      return false;
    }

    await handleAction(button.dataset.flagAction, button);
    return true;
  }

  return {
    render,
    onClick,
    onRouteChange,
  };
}
