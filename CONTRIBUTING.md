# Contributing

Thanks for helping improve Personal Finances (web).

## Before you code

1. Read [`.cursor/architecture/README.md`](.cursor/architecture/README.md) and [`.cursor/rules/AGENTS.md`](.cursor/rules/AGENTS.md).
2. For OSS release standards, see [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source).
3. Pair with [**personal-finances-express-server**](https://github.com/Luckee-Core/personal-finances-express-server) for API and database setup.

## Patterns (short)

- Thin pages in `src/app/`; feature UI in `src/packages/{feature}/`.
- Redux in `src/store/` with manual thunks only (`ThunkResult`); no `createAsyncThunk`.
- HTTP via `src/api/` → Express (`getApiClient()`); no `src/app/api/**`.
- Styles object pattern in components; no per-component CSS modules.
- Use `type`, not `interface`, in new code.

## Pull requests

1. Open an issue for large changes when possible.
2. Keep PRs focused; match existing style in touched files.
3. Run `npm run build` and `npm run lint` before submitting.
4. Update README or `docs/` if you add env vars or change the Express wire contract.

## Security

Report vulnerabilities per [`SECURITY.md`](SECURITY.md) — not via public issues with exploit details.
