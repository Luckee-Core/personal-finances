# OSS security audit notes (web)

Audit date: 2026-06. Guide: [oss-module-security-audit-guide.md](https://github.com/trouthouse-tech/mentorai-server/blob/main/data/open-source/oss-module-security-audit-guide.md).

## Summary

| Area | Result | Notes |
|------|--------|-------|
| Secrets / `NEXT_PUBLIC_*` | Pass | `.env.example` contains only public URLs; no API keys |
| Network exfiltration | Pass | `src/api/` calls configured Express base only |
| Server surface | N/A | No `src/app/api/**` routes |
| Storage | Informational | `personal-finances-sidebar-visible` in `localStorage` (boolean) |
| Live code preview | N/A | No iframe preview feature |
| HTML / Markdown injection | Pass | No `dangerouslySetInnerHTML` / `innerHTML` in `src/` |
| CDN scripts | Pass | Standard Next.js bundle; no unpinned third-party script tags |
| Cookies / auth | Informational | No session cookies; no auth — local-only threat model |
| README honesty | Pass | README documents local/trusted use |
| Dependencies | Rec | Run `npm audit` in CI |

## Residual risk

Exposing Express without auth while pointing the web app at it allows any client on the network to read and mutate financial data. Mitigation: localhost binding, firewall, or add auth before LAN/internet deploy.
