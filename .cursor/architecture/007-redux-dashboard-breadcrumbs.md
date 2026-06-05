# ADR 007: Redux-driven dashboard breadcrumbs

## Status

Accepted

## Context

Dashboard screens render inside `AppLayout`, which needs a consistent breadcrumb bar without prop drilling on every page. Many routes repeat similar static trails (section link + current page label).

## Decision (v1 OSS — static only)

1. **`breadcrumbBuilder` slice** (`src/store/builders/breadcrumbBuilder.ts`) holds a serializable trail: optional `base` (`sectionLabel` + optional `sectionHref`) and `segments` typed in `src/model/breadcrumb/index.ts`.
2. **Segment kinds in v1:** `staticLink` (label + href) and `plainText` (label only). No dropdowns, entity switchers, or non-serializable UI state in Redux.
3. **Resolution in the client layer:** `useResolvedDashboardBreadcrumbs` (`src/components/app-layout-header/index.tsx`) maps builder segments to `AppLayoutBreadcrumb[]` (label + optional href). No closures or React nodes are stored in Redux.
4. **Route ownership:** Dashboard pages register trails with `useRegisterStaticDashboardBreadcrumbs` (`src/utils/dashboard-breadcrumbs/`) or dispatch `BreadcrumbBuilderActions.setTrail` directly. Cleanup on unmount where the page owns the trail exclusively.
5. **Stale trail guard:** `AppLayout` dispatches `BreadcrumbBuilderActions.reset()` in a `useLayoutEffect` keyed on `pathname` so the trail never survives a client-side route change before the next page registers.
6. **Nav-only fallback:** When the builder trail is empty, `AppLayout` shows a single crumb from `resolveDefaultNavBreadcrumbForPathname` so list pages without explicit registration still match the sidebar section.
7. **Presentation:** `BreadcrumbBar` in `AppLayoutHeader` renders links and plain labels only.

### Future (not in v1 OSS)

- **Entity switcher segments** (`entitySwitcher` kind, registry in `resolve-entity-switcher-breadcrumb.ts`) for detail-page dropdowns that swap the current entity without leaving the section.
- **Other non-entity menu segment kinds** (e.g. time-tracking view switchers) resolved in the hook with `onSelect` attached at read time.

Do not implement these until the model, registry, and resolver are added; v1 OSS ships static trails only.

## Consequences

- New dashboard pages use `staticLink` / `plainText` segments only.
- Do not store functions or React nodes in `breadcrumbBuilder` state.
- Entity dropdown breadcrumbs require the future segment kinds above.

## Checklist: new dashboard page

1. **List / section page (no trail)** — do nothing; nav fallback covers it if the path is mapped in `resolveDefaultNavBreadcrumbForPathname`.
2. **Static trail** (fixed labels + links) — in the page (client): `useRegisterStaticDashboardBreadcrumbs([...])` or `dispatch(BreadcrumbBuilderActions.setTrail({ base, segments }))` with `staticLink` / `plainText` segments only; cleanup on unmount if the page owns the trail exclusively.

## Related files

- Model: `src/model/breadcrumb/index.ts`
- Slice: `src/store/builders/breadcrumbBuilder.ts`
- Resolver: `src/components/app-layout-header/index.tsx` (`useResolvedDashboardBreadcrumbs`)
- Static helpers: `src/utils/dashboard-breadcrumbs/`
- Nav base helper: `src/components/navigation/resolve-default-nav-breadcrumb-for-pathname.ts`
