// Minimal router for the popup app. Keep small and framework-agnostic so it can
// be replaced later with react-router or similar if needed.

export type Route = 'home' | 'addons';

export const ROUTES: Route[] = ['home', 'addons'];

export function isRoute(value: string): value is Route {
  return (ROUTES as string[]).includes(value);
}

export function normalizeRoute(maybe: string | undefined): Route {
  if (!maybe) return 'home';
  if (isRoute(maybe)) return maybe;
  return 'home';
}
