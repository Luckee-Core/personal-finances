# Security

## Supported use

**Local / trusted single-operator use** is the primary assumption for this open-source web app. You run Next.js and the companion [personal-finances-express-server](https://github.com/Luckee-Core/personal-finances-express-server) on your machine or a controlled network.

**Before exposing this app or API on a LAN or the internet:** add authentication and authorization, use HTTPS, configure Express CORS explicitly, and add rate limits on AI-backed routes.

## Threat model

| Boundary | Assumption |
|----------|------------|
| Operator | Trusted user on their own machine |
| Input | Financial CSV imports and manual entry are trusted |
| Network | Browser talks only to `NEXT_PUBLIC_SERVER_URL` (your Express instance) |
| Secrets | No Supabase service keys or Anthropic keys in the browser bundle |

## Client storage

| Key | Purpose |
|-----|---------|
| `personal-finances-sidebar-visible` | Persists dashboard sidebar open/closed (`localStorage`) |

Values are booleans only; no credentials are stored in the browser.

## Reporting a vulnerability

**Do not** post exploit details in public issues before a fix is coordinated.

### GitHub private security advisories (preferred)

1. Open this repository on GitHub.
2. Go to the **Security** tab.
3. Use **Report a vulnerability** (private submission).

### Maintainer contact

If private advisories are unavailable, open a minimal public issue asking for a security contact — do not include exploit steps.

## Scope and limitations

- This document does not replace a professional security assessment for production or multi-tenant deployments.
- **`NEXT_PUBLIC_*` variables ship in the browser bundle.** Never put server-only secrets there.
- The web app does not attach `Authorization` headers; Express must enforce access control before wider deploy.

## Audit resources

Pre-release guides: [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source). Web audit notes: [`docs/security/oss-audit-notes.md`](docs/security/oss-audit-notes.md).

## Versions

Security fixes apply to the **default branch** unless maintainers publish a separate support policy.
