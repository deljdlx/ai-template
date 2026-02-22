import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  API_CONFIG,
  getInfos,
  getLaravelInfo,
  getPhpInfo,
  getRuntimeInfo,
  getPackages,
  registerUser,
  loginUser,
  getFeatureFlags,
  createFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
} from '../api.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function okResponse(data) {
  return { ok: true, status: 200, json: () => Promise.resolve(data) };
}

function errorResponse(status, statusText, body = {}) {
  return { ok: false, status, statusText, json: () => Promise.resolve(body) };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('API_CONFIG', () => {
  it('should expose resolved base URL and endpoint map', () => {
    expect(API_CONFIG.baseUrl).toBe('/api');
    expect(API_CONFIG.envKey).toBe('VITE_API_BASE');
    expect(API_CONFIG.endpoints).toEqual({
      infos: '/infos',
      laravel: '/infos/laravel',
      php: '/infos/php',
      runtime: '/infos/runtime',
      packages: '/infos/packages',
      featureFlags: '/feature-flags',
    });
  });
});

describe('getInfos', () => {
  it('should fetch combined infos from /api/infos', async () => {
    const data = { laravel: {}, php: {}, runtime: {} };
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await getInfos();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/infos', expect.objectContaining({
      headers: { Accept: 'application/json' },
    }));
  });

  it('should throw on non-OK response', async () => {
    mockFetch.mockResolvedValue(errorResponse(500, 'Internal Server Error'));

    await expect(getInfos()).rejects.toThrow('API 500');
  });
});

describe('getLaravelInfo', () => {
  it('should fetch from /api/infos/laravel', async () => {
    const data = { framework: 'Laravel', laravel_version: '12.0' };
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await getLaravelInfo();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/infos/laravel', expect.any(Object));
  });
});

describe('getPhpInfo', () => {
  it('should fetch from /api/infos/php', async () => {
    const data = { php_version: '8.3.0', sapi: 'cli' };
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await getPhpInfo();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/infos/php', expect.any(Object));
  });
});

describe('getRuntimeInfo', () => {
  it('should fetch from /api/infos/runtime', async () => {
    const data = { app_name: 'Laravel', timestamp: '2026-02-22T12:00:00+00:00' };
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await getRuntimeInfo();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/infos/runtime', expect.any(Object));
  });
});

describe('getPackages', () => {
  it('should fetch from /api/infos/packages', async () => {
    const data = [
      { name: 'laravel/framework', constraint: '^12.0', version: 'v12.0.1', dev: false },
    ];
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await getPackages();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/infos/packages', expect.any(Object));
  });
});

describe('registerUser', () => {
  it('should POST to /api/auth/register', async () => {
    const data = { user: { id: 1, name: 'Test', email: 'test@example.com' }, token: 'abc123' };
    mockFetch.mockResolvedValue(okResponse(data));

    const payload = { name: 'Test', email: 'test@example.com', password: 'secret123', password_confirmation: 'secret123' };
    const result = await registerUser(payload);

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }));
  });

  it('should throw with validation errors on 422', async () => {
    mockFetch.mockResolvedValue(errorResponse(422, 'Unprocessable Entity', {
      message: 'The email has already been taken.',
      errors: { email: ['The email has already been taken.'] },
    }));

    await expect(registerUser({})).rejects.toThrow('The email has already been taken.');
  });
});

describe('loginUser', () => {
  it('should POST to /api/auth/login', async () => {
    const data = { user: { id: 1, name: 'Test', email: 'test@example.com' }, token: 'xyz789' };
    mockFetch.mockResolvedValue(okResponse(data));

    const payload = { email: 'test@example.com', password: 'secret123' };
    const result = await loginUser(payload);

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload),
    }));
  });
});

describe('feature flags api', () => {
  it('should fetch feature flags list', async () => {
    const data = { scope: 'global', items: [{ name: 'checkout.v2', enabled: true }] };
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await getFeatureFlags();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/feature-flags', expect.any(Object));
  });

  it('should create a feature flag', async () => {
    const data = { name: 'checkout.v2', enabled: true };
    mockFetch.mockResolvedValue(okResponse(data));

    const payload = { name: 'checkout.v2', enabled: true };
    const result = await createFeatureFlag(payload);

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/feature-flags', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload),
    }));
  });

  it('should update a feature flag', async () => {
    const data = { name: 'checkout.v2', enabled: false };
    mockFetch.mockResolvedValue(okResponse(data));

    const result = await updateFeatureFlag('checkout.v2', false);

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('/api/feature-flags/checkout.v2', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ enabled: false }),
    }));
  });

  it('should delete a feature flag', async () => {
    mockFetch.mockResolvedValue(okResponse({}));

    await deleteFeatureFlag('checkout.v2');

    expect(mockFetch).toHaveBeenCalledWith('/api/feature-flags/checkout.v2', expect.objectContaining({
      method: 'DELETE',
    }));
  });
});
