const githubOrg =
  process.env.NEXT_PUBLIC_GITHUB_ORG ?? 'matthewruiz';

export const GITHUB_WEB_URL =
  process.env.NEXT_PUBLIC_GITHUB_WEB_URL ??
  `https://github.com/${githubOrg}/personal-finances`;

export const GITHUB_API_URL =
  process.env.NEXT_PUBLIC_GITHUB_API_URL ??
  `https://github.com/${githubOrg}/personal-finances-express-server`;

export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? `${GITHUB_WEB_URL}#readme`;

export const THT_URL =
  process.env.NEXT_PUBLIC_THT_URL ?? 'https://www.trouthousetech.com';

export const LANDING_BRAND_NAME = 'Personal Finances';

export const LANDING_HERO_KICKER = 'Open source · Self-hostable · AI-assisted';

export const LANDING_HERO_STATS = [
  { k: 'CSV imports', v: 'Bank & credit' },
  { k: 'Editable AI prompts', v: 'Versioned · activatable' },
  { k: 'Full audit trail', v: 'Per-request AI costs' },
] as const;

export const LANDING_REPOS = [
  {
    name: 'personal-finances',
    desc: 'Next.js web app. Redux dashboard, transactions, planning, settings.',
    tag: 'web',
    href: GITHUB_WEB_URL,
  },
  {
    name: 'personal-finances-express-server',
    desc: 'Express data service exposing /api/data/* backed by Supabase.',
    tag: 'api',
    href: GITHUB_API_URL,
  },
] as const;

export const LANDING_ACTIVITY_POINTS = [
  'Transactions list with detail drawer',
  'CSV imports for bank accounts and credit cards',
  'Batch AI slug assignment across imports',
  'Category assignment with your custom prompts',
] as const;

export const LANDING_PLANNING_ITEMS = [
  {
    key: 'recurring',
    title: 'Recurring purchases',
    description: 'Intervals, active filter, and AI-assisted recurring detection.',
  },
  {
    key: 'anticipated',
    title: 'Anticipated costs',
    description: 'Scheduled and planned expenses on the same timeline.',
  },
  {
    key: 'loans',
    title: 'Loans',
    description: 'Balances, payment cadence, and tracked over time.',
  },
  {
    key: 'vendors',
    title: 'Loan vendors',
    description: 'Lenders separated from individual loans for clean reporting.',
  },
] as const;

export const LANDING_AI_PROMPTS = [
  {
    name: 'transaction_slug_assign',
    desc: 'Generates a stable slug per transaction.',
    active: true,
    tokens: '184,402',
    cost: '$1.84',
  },
  {
    name: 'transaction_category_assign',
    desc: 'Maps transactions to your category tree.',
    active: true,
    tokens: '92,118',
    cost: '$0.92',
  },
  {
    name: 'recurring_detect',
    desc: 'Identifies recurring patterns across history.',
    active: false,
    tokens: '21,704',
    cost: '$0.21',
  },
] as const;
