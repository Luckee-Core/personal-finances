# Personal Finances Web — Next.js rules

BEFORE implementing ANY feature, you MUST:
1. Read `.cursor/architecture/README.md`.
2. Read the relevant ADRs in `.cursor/architecture/` (this repo uses **001–009**, **007**; **016** is not applicable).
3. Follow documented patterns EXACTLY; if no pattern exists, you MUST add an ADR first.

## Non-Negotiable Rules

### Redux
1. You MUST keep Redux logic in `src/store/` with flat layers: `dumps/`, `current/`, `builders/`, `filters/` per [001 – Redux patterns](../architecture/001-redux-patterns.md).
2. You MUST use Redux Toolkit slice patterns; NEVER write ad-hoc mutable global state.
3. You MUST use manual thunks only (`AppThunk<Promise<ThunkResult>>`); NEVER use `createAsyncThunk`.
4. You MUST keep async side effects out of components; ALWAYS place them in thunks/services.
5. You MUST NOT import `store` directly in package components; use thunks and hooks only.

### Components
1. You MUST keep route segments in `src/app/`; feature UI MUST live in `src/packages/<feature>/`; cross-feature shared UI MUST live in `src/components/`.
2. You MUST keep components focused and composable; NEVER mix data orchestration with presentational markup.
3. You MUST default to Server Components and ONLY use `"use client"` when browser APIs/state are required.
4. You MUST pass explicit typed props; NEVER use `any` in component public interfaces.
5. Dashboard breadcrumb registration in pages is allowed per [007 – Dashboard breadcrumbs](../architecture/007-redux-dashboard-breadcrumbs.md).

### Styling
1. You MUST follow the **styles object pattern** in [003 – Styling rules](../architecture/003-styling-rules.md).
2. You MUST keep design tokens and global rules in `src/app/globals.css`.
3. You MUST NOT use inline `style={{ ... }}` except truly dynamic one-off values (portal position, theme color from data) per ADR 003.
4. You MUST NOT create per-component `.css` / `.module.css` files.

### API
1. Domain API clients live in `src/api/{domain}/client.ts`; HTTP transport in `src/api/client/`.
2. You MUST call Express via `getApiClient()`; there is no `src/app/api/**` layer (see [008 – Express API boundary](../architecture/008-express-api-boundary.md)).
3. You MUST return `ApiResponse<T>` from API clients; thunks map failures to `ThunkResult`.
4. Components NEVER call API directly — thunks only.
5. You MUST add JSDoc to every exported function in `src/api/**/client.ts` and to thunks.

### Files
1. You MUST colocate files by feature/domain; one primary function or component per file per [005 – File organization](../architecture/005-file-organization.md).
2. You MUST use `type`, not `interface`.
3. You MUST use barrel exports (`index.ts`) in `utils/`, `api/`, and `store/` subfolders.
4. You MUST keep import boundaries clean; prefer `@/utils/{domain}` barrels over deep paths.

## Quick reference (ADRs in *this* repo)

- Architecture index → `.cursor/architecture/README.md`
- Redux → `.cursor/architecture/001-redux-patterns.md`
- Component composition & thin pages → `.cursor/architecture/002-component-composition.md`
- Styling → `.cursor/architecture/003-styling-rules.md`
- API integration → `.cursor/architecture/004-api-integration.md`
- Express API boundary → `.cursor/architecture/008-express-api-boundary.md`
- File organization → `.cursor/architecture/005-file-organization.md`
- Constants / utilities → `.cursor/architecture/006-constants-utilities.md`
- Dashboard breadcrumbs → `.cursor/architecture/007-redux-dashboard-breadcrumbs.md`
- Documentation site (`/docs` sidebar) → `.cursor/architecture/009-api-docs-page.md`
