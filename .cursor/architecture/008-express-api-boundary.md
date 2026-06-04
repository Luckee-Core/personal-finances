# 008 - Express API boundary (Next.js client)

## Status
Accepted

## Context
**personal-finances** is a Next.js app that reads and writes data through **personal-finances-express-server**, not through `src/app/api/**` route handlers. API clients must stay typed and thunks must remain the only client-side callers.

## Decision

### 1) HTTP transport
- Base URL: `API_CONFIG.SERVER_URL` from `src/config/api.ts`.
- Client factory: `getApiClient()` in `src/api/client/index.ts` (fetch wrapper).
- Paths: Express `/api/data/{entity}` and `/api/ai/*` as implemented on the server.

### 2) Domain API layout
```text
src/api/
  client/index.ts          # shared fetch client
  types.ts                 # ApiResponse<T>, ThunkStatus, ApiErrorCode
  _shared/express-response.ts  # maps { success, data, error } bodies
  {domain}/
    client.ts              # outbound HTTP + ApiResponse mapping
    index.ts               # barrel re-exports
```

- Do **not** add `src/app/api/**` unless a future ADR explicitly requires a Next.js BFF layer.
- Components **never** call `getApiClient()` or domain clients; thunks do (see ADR 004).

### 3) `ApiResponse<T>` contract
Defined in `src/api/types.ts`. Domain `client.ts` files return `Promise<ApiResponse<T>>` for every exported function.

Success:
```ts
{ ok: true, status: 200, data: T }
```

Failure:
```ts
{ ok: false, status: number, error: { code: ApiErrorCode, message: string } }
```

Use `fromExpressBody`, `fromExpressListBody`, `fromExpressVoidBody`, and `fromCaughtError` from `src/api/_shared/express-response.ts` to normalize Express JSON shapes.

### 4) Thunk mapping
Thunks translate `ApiResponse` into `ThunkResult`:

```ts
const result = await createLoan(payload);
if (!result.ok) {
  return { status: result.status >= 500 ? 500 : 400, message: result.error.message };
}
dispatch(LoansActions.upsertLoan(result.data));
return { status: 200 };
```

### 5) JSDoc
Every exported function in `src/api/**/client.ts` must have JSDoc describing purpose and return shape.

## Consequences
- Single backend boundary (Express + Supabase) keeps deployment and auth simple.
- Typed clients and thunks make error handling consistent in UI.
- No duplicate API logic in Next.js route handlers.

## Related
- [004 – API integration](./004-api-integration.md) (general thunk-only rules; treat Next `app/api` examples as N/A here)
- Express server [011 – Personal Finances `/api/data` REST](../../personal-finances-express-server/.cursor/architecture/011-personal-finances-api-data.md)
