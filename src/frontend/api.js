/**
 * API client for the Laravel backend.
 *
 * Configuration: set VITE_API_BASE env var to override the default base URL.
 * In dev, Vite's proxy forwards /api to http://localhost:8000.
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * Fetches JSON from the given API path.
 * @param {string} path - Relative path under API_BASE (e.g. '/infos')
 * @returns {Promise<Object>}
 */
async function fetchJson(path) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/** @returns {Promise<Object>} Combined laravel + php + runtime infos */
export const getInfos = () => fetchJson('/infos');

/** @returns {Promise<Object>} Laravel framework info */
export const getLaravelInfo = () => fetchJson('/infos/laravel');

/** @returns {Promise<Object>} PHP runtime info */
export const getPhpInfo = () => fetchJson('/infos/php');

/** @returns {Promise<Object>} Server runtime info (timestamps, app name) */
export const getRuntimeInfo = () => fetchJson('/infos/runtime');
