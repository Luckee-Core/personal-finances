import {
  AI_COSTS_PATH,
  AI_PROMPT_DETAIL_PATH,
  AI_PROMPTS_PATH,
  BANK_ACCOUNTS_PATH,
  CREDIT_CARDS_PATH,
  HOME_PATH,
  RECURRING_PATH,
  RECURRING_PURCHASE_DETAIL_PATH,
  STATEMENT_IMPORTS_PATH,
  STATEMENT_IMPORT_DETAIL_PATH,
  TRANSACTIONS_PATH,
  TRANSACTION_DETAIL_PATH,
} from '@/config/routes';

export type SidebarLink = {
  name: string;
  href: string;
  activePathPrefix?: string | string[];
};

export type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

export const getSidebarSections = (): SidebarSection[] => [
  {
    title: 'Overview',
    links: [{ name: 'Dashboard', href: HOME_PATH }],
  },
  {
    title: 'Activity',
    links: [
      {
        name: 'Transactions',
        href: TRANSACTIONS_PATH,
        activePathPrefix: [TRANSACTIONS_PATH, TRANSACTION_DETAIL_PATH],
      },
    ],
  },
  {
    title: 'Planning',
    links: [
      {
        name: 'Recurring',
        href: RECURRING_PATH,
        activePathPrefix: [RECURRING_PATH, RECURRING_PURCHASE_DETAIL_PATH],
      },
    ],
  },
  {
    title: 'Data',
    links: [
      {
        name: 'Bank accounts',
        href: BANK_ACCOUNTS_PATH,
        activePathPrefix: BANK_ACCOUNTS_PATH,
      },
      {
        name: 'Credit cards',
        href: CREDIT_CARDS_PATH,
        activePathPrefix: CREDIT_CARDS_PATH,
      },
      {
        name: 'Imports',
        href: STATEMENT_IMPORTS_PATH,
        activePathPrefix: [STATEMENT_IMPORTS_PATH, STATEMENT_IMPORT_DETAIL_PATH],
      },
    ],
  },
  {
    title: 'Settings',
    links: [
      {
        name: 'AI Prompts',
        href: AI_PROMPTS_PATH,
        activePathPrefix: [AI_PROMPTS_PATH, AI_PROMPT_DETAIL_PATH],
      },
      {
        name: 'AI Costs',
        href: AI_COSTS_PATH,
        activePathPrefix: AI_COSTS_PATH,
      },
    ],
  },
];
