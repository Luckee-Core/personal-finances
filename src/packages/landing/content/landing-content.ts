const githubOrg =
  process.env.NEXT_PUBLIC_GITHUB_ORG ?? 'Luckee-Core';

export const GITHUB_WEB_URL =
  process.env.NEXT_PUBLIC_GITHUB_WEB_URL ??
  `https://github.com/${githubOrg}/personal-finances`;

export const GITHUB_API_URL =
  process.env.NEXT_PUBLIC_GITHUB_API_URL ??
  `https://github.com/${githubOrg}/personal-finances-express-server`;

export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? '/docs';

export const THT_URL =
  process.env.NEXT_PUBLIC_THT_URL ?? 'https://www.trouthousetech.com';

export const LANDING_BRAND_NAME = 'Personal Finances';

export const LANDING_HERO_KICKER = 'Open source · Self-hostable · Your data';

export const LANDING_HERO_HEADLINE = 'See where the money went';
export const LANDING_HERO_HEADLINE_ACCENT = 'before you guess on the 28th.';

export const LANDING_HERO_SUB =
  'I got tired of reconciling bank CSVs in spreadsheets and re-categorizing the same merchants every month. Import statements, tune the AI prompts, track recurring bills and loans — on your Supabase project, not someone else\'s dashboard.';

export const LANDING_HERO_CTA_PRIMARY = 'Clone & self-host';
export const LANDING_HERO_CTA_SECONDARY = 'See the dashboard';

export const LANDING_HERO_STATS = [
  { k: 'CSV imports', v: 'Bank & credit statements' },
  { k: 'Your prompts', v: 'Versioned · activatable' },
  { k: 'Token audit', v: 'Per-request AI costs' },
] as const;

export const LANDING_REPOS = [
  {
    name: 'personal-finances',
    desc: 'Next.js dashboard — Redux, transactions, planning, AI prompt settings.',
    tag: 'web',
    href: GITHUB_WEB_URL,
  },
  {
    name: 'personal-finances-express-server',
    desc: 'Express `/api/data` service backed by Supabase. AI workers under `/api/ai`.',
    tag: 'api',
    href: GITHUB_API_URL,
  },
] as const;

export const LANDING_ACTIVITY_POINTS = [
  'Transactions list with a detail view when you need to fix one row',
  'CSV imports for bank accounts and credit cards',
  'Batch slug assignment — your prompt, your rules',
  'Category assignment you can override line by line',
] as const;

export const LANDING_PLANNING_ITEMS = [
  {
    key: 'recurring',
    title: 'Recurring purchases',
    description: 'Intervals, filters, and AI-assisted detection when you want help.',
  },
  {
    key: 'anticipated',
    title: 'Anticipated costs',
    description: 'Planned expenses on the same timeline as recurring bills.',
  },
  {
    key: 'loans',
    title: 'Loans',
    description: 'Balances and payment cadence — not a separate spreadsheet.',
  },
  {
    key: 'vendors',
    title: 'Loan vendors',
    description: 'Lenders split from individual loans so reporting stays clean.',
  },
] as const;

export const LANDING_AI_PROMPTS = [
  {
    name: 'transaction_slug_assign',
    desc: 'Stable slug per transaction — useful before categorization.',
    active: true,
    tokens: '184,402',
    cost: '$1.84',
  },
  {
    name: 'transaction_category_assign',
    desc: 'Maps memo text to your category tree.',
    active: true,
    tokens: '92,118',
    cost: '$0.92',
  },
  {
    name: 'recurring_detect',
    desc: 'Finds recurring patterns across history.',
    active: false,
    tokens: '21,704',
    cost: '$0.21',
  },
] as const;
