# Frontend Code Review & Recommendations

This document summarizes improvement opportunities across the `frontend` directory. It focuses on maintainability, performance, DX, and security without changing current behavior.

## Architecture & State Management
- Pinia usage is clean and composable. Consider extracting cross-store concerns (e.g., loading/error patterns) into a small helper module or base store type to avoid ad-hoc patterns across stores.
- `storeAction` is a good abstraction. Consider returning a normalized error shape and optionally supporting cancellation/AbortSignal to handle rapid route changes or repeated actions.
- Add typed error helpers to avoid sprinkling `err.response?.data?.detail` in multiple places; centralize API error normalization.
- For long-running derived data (e.g., `portfolioMetrics`), consider memoization and narrow reactive dependencies to avoid unnecessary recomputes.

## API Client & Networking
- Token refresh queuing is solid. Consider extracting the refresh logic into a dedicated module to enable reuse in SSR or tests and to reduce coupling to the store.
- Interceptor accesses Pinia store at module scope. This generally works after `pinia` is installed, but to avoid edge initialization cases during test/bootstrap, consider injecting a `getAccessToken` function into the client, or initializing interceptors after app bootstrap.
- Unify refresh flows: there are two refresh token code paths (`authApi.refreshToken` and interceptor). Prefer one code path (interceptor) and make other usages call into it.
- Consider adding Axios request cancellation (AbortController) for route changes or repeated search inputs; propagate `signal` down from components.
- Add retry/backoff only for idempotent reads if you see transient 5xx failures (guard with caps to avoid overload).

## Routing & Auth
- Router guard is straightforward. Add typing for route meta by augmenting `vue-router` to ensure `requiresAuth` is typed and prevent typos.
- Consider handling “redirect back” edge cases by validating the `redirect` query parameter and limiting to same-origin paths.
- Prefer `router.replace('/login')` over `window.location.href = '/login'` inside the interceptor for a smoother SPA experience; if a full reload is necessary, document why.
- If the app may deploy under a subpath, pass `base: import.meta.env.BASE_URL` to `createWebHistory` and set `BASE_URL` correctly in Vite.

## Performance
- Good use of route-level code splitting and virtualization in Strategies. Consider:
  - Virtualization in Orders (when list grows) or ensure pagination is always used.
  - Debounce search inputs to reduce recomputations and API pressure (if wired to APIs later).
  - Add `stale-while-revalidate` patterns consistently. E.g., `loadDashboardData` already does background stats fetch; add guards to prevent racing updates (track last request timestamp or use a token).
- Ensure large computed classes/arrays in templates are stable (extract with `computed`) to minimize re-renders.

## Types & Domain Models
- Replace string unions repeated across the codebase with centralized enums/types (e.g., Order status, order sides). This improves reuse and reduces typos.
- For server payloads that change over time, consider schema validation (e.g., `zod`) for critical endpoints to fail fast and surface clean errors.
- Export DTOs for request bodies separately from view-model types to avoid accidental reuse in forms.

## Security
- Persisting tokens in `localStorage` is convenient but increases XSS blast radius. Consider switching to httpOnly cookies with CSRF protection, or at least:
  - Narrow persistence to the bare minimum (already only tokens; great).
  - Add an idle/session timeout and provenance checks (e.g., token audience) during bootstrap.
  - Ensure all user-provided strings rendered in templates are trusted/sanitized.
- Avoid full-page reloads for logout unless needed; ensure all sensitive in-memory state is cleared on logout.

## UX & Accessibility
- Components are visually consistent. Add ARIA roles/labels where appropriate (dialog, nav, buttons-with-icons) and ensure keyboard operability for dropdowns/menus and dialogs.
- Define focus traps and Escape handling for dialogs to improve accessibility.
- Ensure sufficient color contrast in dark mode variants; consider an automated accessibility scan in CI.
- Add a global toast/notification system for success/error instead of ad-hoc success banners.
- Consider loading skeletons for key dashboards/tables to improve perceived performance.

## Testing
- Nice start with unit tests. Suggested additions:
  - Stores: mock API and test success/error branches for `strategies`, `dashboard`, and `auth`.
  - Router guard: test redirects for each auth state.
  - Components: interaction tests for dialog, dropdown, and virtualization boundaries.
  - E2E: add Playwright suite for happy-path flows (login, create/edit strategy, run now, view orders).

## Build, Config & Tooling
- Consider adding ESLint + Prettier with a strict config and a pre-commit hook (Husky) to keep formatting and imports consistent.
- Commit an `.env.example` documenting required variables and defaults; keep `.env.local` in `.gitignore`.
- `frontend/dist` is present in the repo. Recommend ignoring build artifacts via `.gitignore` and excluding them from VCS.
- Pin Vite/Vue plugin versions via Renovate/Dependabot; add CI to run `vue-tsc`, `vitest`, and a production build.
- Consider splitting Vite config into env-aware presets (dev/prod) if backend/proxy rules diverge by environment.

## Styling
- Tailwind setup looks good. Extract commonly reused compound classes into components/utilities (already started with `.btn-*`, `.card`, `.input`).
- Consider a design tokens layer (CSS variables) for colors/spacings to enable theming tweaks without touching many components.
- Add a dark-mode toggle that persists preference and syncs with system preference.

## Code Consistency & Misc
- Prefer using `router.replace` for navigational redirects after state-changing actions (e.g., logout) to reduce history noise.
- Use `void` before intentionally unawaited promises to document fire-and-forget behavior (background refreshes).
- Replace `console.*` with a central logger that no-ops in production or routes to an observability endpoint.
- Document the Strategy interval string format in code (JSDoc) and centralize validation to reuse in multiple views.
- Consider extracting shared table utilities (sorting, pagination, filtering) into a composable to avoid duplication across lists.

## Deployment & Ops
- If deploying behind a path prefix or reverse proxy, document the expected envs, `BASE_URL`, and `VITE_API_BASE_URL` strategy for dev vs. prod.
- Add basic CSP guidance in the hosting layer; disallow inline scripts where possible.

## Quick Win Checklist
- Add ESLint/Prettier + Husky pre-commit.
- Ignore `frontend/dist` and local env files in VCS.
- Add typed `RouteMeta` augmentation and use `router.replace` in auth flows.
- Introduce a lightweight toast system for consistent feedback.
- Debounce search inputs and add request cancellation in list views.

If you want, I can take on any of the above as a small PR next.

