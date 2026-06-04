# Architecture Documentation

This folder contains Architecture Decision Records (ADRs) for the **personal-finances** Next.js app. Each ADR documents a decision, why it was made, and how to apply it consistently.

## Why ADRs?

ADRs keep implementation consistent across the project by documenting:

- **What** standard we follow
- **Why** we chose it
- **How** to apply it in everyday development

## ADR index

| ADR | Topic |
| --- | --- |
| [001](./001-redux-patterns.md) | Redux — flat `dumps` / `current` / `builders` / `filters`, manual thunks, `ThunkResult` |
| [002](./002-component-composition.md) | Component composition — thin pages, `src/packages/` |
| [003](./003-styling-rules.md) | Styling — `styles` object pattern; dynamic inline exceptions |
| [004](./004-api-integration.md) | API integration — thunk-only access, `ApiResponse<T>` |
| [005](./005-file-organization.md) | File organization — folders, barrels, named exports |
| [006](./006-constants-utilities.md) | Constants and utilities — pure helpers, domain folders |
| [007](./007-redux-dashboard-breadcrumbs.md) | Dashboard breadcrumbs — `breadcrumbBuilder` slice |
| [008](./008-express-api-boundary.md) | **Express API boundary** — no `src/app/api`; clients → Express |
| [016](./016-standalone-chat-studio-ui-contract.md) | **Not applicable** — chat studio UI (no feature in this repo) |

## How to use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change—and **update this index**.

## Backend

Server conventions live in **personal-finances-express-server** `.cursor/architecture/` (especially [011](../personal-finances-express-server/.cursor/architecture/011-personal-finances-api-data.md) for `/api/data`).
