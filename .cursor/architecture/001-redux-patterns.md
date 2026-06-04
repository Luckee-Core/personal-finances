# 001 - Redux Patterns (Next.js)

## Status
Accepted

## Context
This ADR defines mandatory Redux patterns for **personal-finances** so async flows, slice state, and reducer behavior remain predictable across features.

## Decision

### 1) Use manual thunks only (`createAsyncThunk` is forbidden)
All async flows must be implemented as handwritten thunk functions. Do not use `createAsyncThunk`.

✅ **Do**
```ts
// src/store/thunks/loans/create-loan-thunk.ts
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';
import { createLoan } from '@/api/loans';
import { LoansActions } from '@/store/dumps';

export const createLoanThunk =
  (payload: CreateLoanPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createLoan(payload);
    if (!result.ok) {
      return { status: result.status >= 500 ? 500 : 400, message: result.error.message };
    }
    dispatch(LoansActions.upsertLoan(result.data));
    return { status: 200 };
  };
```

❌ **Don't**
```ts
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadLoans = createAsyncThunk('loans/load', async () => {
  const response = await fetch('/api/data/loans');
  return response.json();
});
```

---

### 2) Thunk signature: `AppThunk<Promise<ThunkResult>>`
Thunk return values use `ThunkResult` (`status: 200 | 400 | 500` plus optional `message` and batch fields). Components check `result.status === 200` after `dispatch`.

✅ **Do**
```ts
// src/store/types.ts
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// src/store/thunks/thunk-result.ts
export type ThunkResult =
  | { status: 200; message?: string; batchProcessed?: number; /* ... */ }
  | { status: 400 | 500; message: string };
```

❌ **Don't**
```ts
export const saveLoan = () => async () => true; // ambiguous return contract
```

```ts
export const saveLoan = (): any => async () => ({ status: 200 }); // any is not allowed
```

---

### 3) Flat layer structure (`dumps`, `current`, `builders`, `filters`)
State is organized as **top-level reducer keys** by layer, not nested `dumps/current/builders/config` inside each feature slice.

| Layer | Location | Shape |
| --- | --- | --- |
| **dumps** | `src/store/dumps/{entity}.ts` | `Record<string, Entity>` per catalog entity |
| **current** | `src/store/current/{entity}.ts` | Single selected entity for detail routes |
| **builders** | `src/store/builders/*.ts` | Serializable UI state (breadcrumbs, dashboard filters) |
| **filters** | `src/store/filters/*.ts` | Query/filter state (e.g. transaction filters) |

`rootReducer` in `src/store/reducer.ts` combines these layers explicitly.

✅ **Do**
```ts
// src/store/dumps/loans.ts
const initialState: Record<string, Loan> = {};

export const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setLoans: (_state, action: PayloadAction<Record<string, Loan>>) => action.payload,
    upsertLoan: (state, action: PayloadAction<Loan>) => {
      state[action.payload.id] = action.payload;
    },
  },
});
```

```ts
// src/store/reducer.ts
export const rootReducer = combineReducers({
  loans: loansReducer,
  currentTransaction: currentTransactionReducer,
  breadcrumbBuilder: breadcrumbBuilderReducer,
  transactionFilters: transactionFiltersReducer,
  // ...
});
```

❌ **Don't**
```ts
// Nested per-feature shape (not used in this repo)
type LoansState = {
  dumps: { list: Loan[] };
  current: { selectedId: string | null };
  builders: { form: { name: string } }; // objects in builders (forbidden)
};
```

---

### 4) Reducers must be logic-free (business logic belongs in thunks)
Reducers only apply payloads and set flags. Validation, branching, transformation, and side effects must live in thunks or pure `src/utils/` functions.

✅ **Do** — `upsertLoan` assigns `action.payload` directly.

❌ **Don't** — filter, dedupe, or derive data inside reducers.

---

### 5) `builders` slices must not store objects
`builders` can contain primitives, literal unions, and arrays of primitives only. Never store nested objects/maps in `builders` (see ADR 007 for breadcrumb trail shape).

✅ **Do**
```ts
type DashboardBuilderState = {
  timePeriod: DashboardTimePeriod;
  filteredCategory: string | null;
};
```

❌ **Don't**
```ts
type BuildersState = {
  form: { title: string; filters: { status: string } };
  byId: Record<string, { enabled: boolean }>;
};
```

---

### 6) Components must not import `store` directly
Use `useAppDispatch` / `useAppSelector` in components. Pass `getState` only inside thunks via the `AppThunk` callback argument.

❌ **Don't**
```ts
import { store } from '@/store';
store.getState(); // in a package component
```

---

## Consequences
- Async control flow is explicit and easier to trace.
- `ThunkResult` gives UI a stable contract with optional error messages.
- Flat layers (`dumps` / `current` / `builders` / `filters`) match `src/store/` layout and reduce onboarding friction.
- Reducers stay deterministic and simple to test.

## Related
- [008 – Express API boundary](./008-express-api-boundary.md)
- [007 – Dashboard breadcrumbs](./007-redux-dashboard-breadcrumbs.md)
