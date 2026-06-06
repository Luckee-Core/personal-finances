# 009 – Documentation site (`/docs`)

## Status
Accepted

## Context
**personal-finances** calls Express for all domain data (ADR 008). Documentation includes prose guides (self-host setup, open source, security) and a live API reference catalog from Express at `GET /api-docs.json` (express ADR 012). This ADR defines how the web app renders `/docs/**`.

## Decision

### 1) Docs shell and routes
- Shared layout: `src/app/docs/layout.tsx` wraps all docs routes in `DocsShell` from `src/packages/docs/`.
- `/docs` redirects to `/docs/getting-started`.
- Prose pages are thin Server Components under `src/app/docs/**/page.tsx`.
- API reference: `src/app/docs/api/page.tsx` → `ApiDocsView` (client) from `src/packages/api-docs/`.

### 2) Package layout
| Package | Role |
| --- | --- |
| `src/packages/docs/` | Shell, sidebar, nav tree, shared article styles |
| `src/packages/api-docs/` | API catalog UI (`ApiDocsView`, `ApiDocsContent`, `EndpointCard`) |

Cross-feature docs chrome lives in `src/packages/docs/`; API-specific rendering stays in `src/packages/api-docs/`.

### 3) Sidebar navigation
- Two sections in `DocsSidebar`: **Guides** (`DOCS_SIDEBAR_GUIDES`) and **API** (catalog entities).
- API entities are injected from the Express catalog in `src/app/docs/layout.tsx` via `buildApiGroupSidebarChildren()`.
- Path constants in `src/config/routes.ts` (`DOCS_*`).
- `DocsSidebar` is a client component using `usePathname()` and `hashchange` for active states on `#group-*` anchors.
- No secondary in-page nav on `/docs/api` — entities are flat links under the API section (no “API reference” parent).

### 4) Data fetching (single layout fetch)
- `src/app/docs/layout.tsx` calls `getApiDocsCatalogCached()` once and passes the snapshot to `DocsCatalogProvider`.
- `ApiDocsView` reads that context — **no second fetch** on `/docs/api` (avoids RSC/client hydration drift).
- **No Redux slice or thunk** — catalog is ephemeral page data, not dashboard state.
- Do **not** add `src/app/api/**` route handlers for docs.

### 5) API client
- `getApiDocsCatalog()` returns `Promise<ApiResponse<ApiDocsCatalog>>`.
- Uses `getApiClient()` and `fromExpressBody` per ADR 008.
- Catalog types duplicated in `src/api/api-docs/types.ts` (no shared npm package).

### 6) UI rules
- Named exports only; default export only on `app/docs/**/page.tsx`.
- Styles object pattern (ADR 003); one primary component per file (ADR 005).
- `/docs` is outside `(dashboard)/` — no breadcrumb registration (ADR 007).

### 7) Landing link
- `DOCS_URL` in `landing-content.ts` points to `/docs` (redirects to getting started).

### 8) Future try-it-out (optional)
- A `'use client'` subcomponent may call `getApiClient()` for sandbox requests — docs-only exception, not domain CRUD via components.

## Consequences
- Express must be running for `/docs/api` to load catalog content; prose pages are static.
- Catalog shape changes require updates in both repos.
- New docs pages require an entry in `DOCS_SIDEBAR_GUIDES` and a route constant in `src/config/routes.ts`.

## Related
- [008 – Express API boundary](./008-express-api-boundary.md)
- [002 – Component composition](./002-component-composition.md)
- express server [012 – API docs catalog](../../personal-finances-express-server/.cursor/architecture/012-api-docs-catalog.md)
