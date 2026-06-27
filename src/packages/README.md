# `src/packages` — Feature modules

**Domain-owned UI** for Personal Finances: one folder per screen. Route files under `src/app` import the package barrel only.

## Screen map

| Route | Package |
|-------|---------|
| `/` | `landing/` |
| `/docs/*` | `docs/` |
| `/docs/api` | `api-docs/` |
| `/dashboard` | `dashboard/` |
| `/transactions` | `transactions/` |
| `/transaction-detail` | `transaction-detail-page/` |
| `/recurring` | `recurring-purchases/` |
| `/recurring-purchase-detail` | `recurring-purchase-detail-page/` |
| `/anticipated-costs` | `anticipated-costs/` |
| `/loans` | `loans/` |
| `/loan-vendors` | `loan-vendors/` |
| `/bank-accounts` | `bank-accounts/` |
| `/credit-cards` | `credit-cards/` |
| `/statement-imports` | `statement-imports/` |
| `/statement-import-detail` | `statement-import-detail-page/` |
| `/ai-prompts` | `ai-prompts/` |
| `/ai-prompt-detail` | `ai-prompt-detail/` |
| `/ai-costs` | `ai-costs/` |
| `/categories` (combobox) | `categories/` |

Path constants: `src/config/routes.ts`.

## Layout (typical)

```text
src/packages/<feature>/
  index.tsx           # Main component — export const FeaturePage = …
  index.ts            # Barrel re-exports public API (ADR 005)
  <sub-component>/    # One component per folder when split
    index.tsx
```

Table-specific formatters live under the feature package, not `src/utils/{table}/`.

## Redux and API

| Concern | Location |
|---------|----------|
| Slices, builders, dumps | `src/store/` |
| Thunks | `src/store/thunks/` |
| HTTP clients | `src/api/{domain}/` |
| Domain types | `src/model/` |

Packages dispatch thunks via `useAppDispatch` / `useAppSelector` from `@/store`. **Do not** add `store/` or `api/` inside packages.

Browser calls Express directly via `NEXT_PUBLIC_SERVER_URL` (ADR 008 — no Next.js BFF).
