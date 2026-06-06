# Personal Finances (open source)

**TL;DR:** Self-hosted money dashboard — import bank and credit CSVs, categorize with **your** AI prompts, track recurring bills and loans. Next.js + Redux on the front; Express + Supabase on the back. Pairs with [**personal-finances-express-server**](https://github.com/Luckee-Core/personal-finances-express-server).

I built this because I kept reconciling statements in spreadsheets and re-fixing the same categories every month. I wanted imports, editable prompts, and an honest view of recurring costs — on **my** stack, not a SaaS ledger I do not control.

Read **`SECURITY.md`** before you point this at anything beyond localhost.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Dashboard: **`/dashboard`**
- Documentation: **`/docs`** (sidebar guides; API reference at **`/docs/api`** — start Express first)

Copy **`.env.example`** → **`.env.local`**. Set **`NEXT_PUBLIC_SERVER_URL`** to your Express base URL (dev default when unset: `http://localhost:3011`).

Full pair setup (Express first, then web): [express `docs/oss-quickstart.md`](https://github.com/Luckee-Core/personal-finances-express-server/blob/main/docs/oss-quickstart.md).

## What you get

- **CSV imports** for bank accounts and credit cards
- **Transactions** with slug + category assignment (batch or one-off)
- **Recurring purchases**, anticipated costs, loans, loan vendors
- **AI prompts** you version and activate — slug assign, category assign, recurring detect
- **AI cost audit** — per-request tokens and spend (30 / 90 / 365-day views)

## Repo layout

| Path | What lives here |
|------|-----------------|
| **`src/app`** | App Router pages (thin wrappers) |
| **`src/components`** | Shared shell (layout, sidebar, header) |
| **`src/packages`** | Feature modules (transactions, dashboard, docs, loans, …) |
| **`src/model`** | Shared domain `type` definitions |
| **`src/api`** | Express HTTP clients (`getApiClient`) |
| **`src/store`** | Redux slices and manual thunks |
| **`src/utils`** | Pure helpers by domain |
| **`docs`** | Security audit notes |

Architecture ADRs: **`.cursor/architecture/README.md`** (docs site: [009 – `/docs` sidebar](.cursor/architecture/009-api-docs-page.md)). Agent rules: **`.cursor/rules/AGENTS.md`**.

## Pair with Express

| Resource | Link |
|----------|------|
| Express API | [Luckee-Core/personal-finances-express-server](https://github.com/Luckee-Core/personal-finances-express-server) |
| Database setup | [SQL run order](https://github.com/Luckee-Core/personal-finances-express-server/blob/main/docs/database-setup.md) |
| OSS governance | [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source) |

License: MIT — see **`LICENSE`**.

## Local development and trust

Written for **solo or trusted-team use on your machine** by default. Run Next and Express on **`127.0.0.1`** (or behind a firewall) until Express enforces authentication. There is no login in the OSS default — that is a feature gap, not a promise of privacy on a shared network.

**Client vs server secrets**

- **`NEXT_PUBLIC_*` variables ship in the browser bundle.** Never put Supabase service keys or Anthropic keys there.
- **`src/api`** does not send `Authorization` headers. If the API is reachable from your LAN or the internet, add auth, HTTPS, CORS, and rate limits before you rely on it.

**Browser storage**

- `personal-finances-sidebar-visible` — sidebar open/closed preference only (`localStorage`).

## Built by

Matt @ [TroutHouseTech](https://www.trouthousetech.com) — Philly. Same OSS patterns as [Lead Studio](https://github.com/lead-open-source/lead-studio-web-open-source) and the other Luckee studios.
