import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInfos, getLaravelInfo, getPhpInfo, getRuntimeInfo, getPackages } from '../api.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function okResponse(data) {
  return { ok: true, status: 200, json: () => Promise.resolve(data) };
}

function errorResponse(status, statusText) {
  return { ok: false, status, statusText };
}

beforeEach(() => {
  mockFetch.mockReset();
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
