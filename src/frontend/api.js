/**
 * API client for the Laravel backend.
 *
 * Configuration: set VITE_API_BASE env var to override the default base URL.
 * In dev, Vite's proxy forwards /api to http://localhost:8000.
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const API_ENDPOINTS = Object.freeze({
  infos: '/infos',
  laravel: '/infos/laravel',
  php: '/infos/php',
  runtime: '/infos/runtime',
  packages: '/infos/packages',
});

export const API_CONFIG = Object.freeze({
  baseUrl: API_BASE,
  envKey: 'VITE_API_BASE',
  endpoints: API_ENDPOINTS,
});

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
export const getInfos = () => fetchJson(API_ENDPOINTS.infos);

/** @returns {Promise<Object>} Laravel framework info */
export const getLaravelInfo = () => fetchJson(API_ENDPOINTS.laravel);

/** @returns {Promise<Object>} PHP runtime info */
export const getPhpInfo = () => fetchJson(API_ENDPOINTS.php);

/** @returns {Promise<Object>} Server runtime info (timestamps, app name) */
export const getRuntimeInfo = () => fetchJson(API_ENDPOINTS.runtime);

/** @returns {Promise<Array>} List of installed Composer packages */
export const getPackages = () => fetchJson(API_ENDPOINTS.packages);
