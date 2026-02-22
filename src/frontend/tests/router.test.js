import { describe, expect, it } from 'vitest';
import { normalizePath, createRouteMatcher, findMatchingRoute } from '../router.js';

describe('normalizePath', () => {
  it('normalizes empty and root paths', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
  });

  it('removes query string and trailing slash', () => {
    expect(normalizePath('/about/?x=1')).toBe('/about');
    expect(normalizePath('about/')).toBe('/about');
  });
});

describe('createRouteMatcher', () => {
  it('matches static routes', () => {
    const route = createRouteMatcher('/about');
    expect(route.match('/about')).toEqual({});
    expect(route.match('/other')).toBeNull();
  });

  it('matches dynamic params', () => {
    const route = createRouteMatcher('/post/:id');
    expect(route.match('/post/42')).toEqual({ id: '42' });
    expect(route.match('/post')).toBeNull();
  });
});

describe('findMatchingRoute', () => {
  it('returns the first matching route with params', () => {
    const routes = [
      { path: '/about', matcher: createRouteMatcher('/about') },
      { path: '/post/:id', matcher: createRouteMatcher('/post/:id') },
    ];

    const match = findMatchingRoute('/post/123', routes);
    expect(match).toEqual({
      route: routes[1],
      params: { id: '123' },
    });
  });
});
