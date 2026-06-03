import {
  AI_PROMPTS_PATH,
  BANK_ACCOUNTS_PATH,
  CREDIT_CARDS_PATH,
  HOME_PATH,
  RECURRING_PATH,
  STATEMENT_IMPORTS_PATH,
  TRANSACTIONS_PATH,
} from '@/config/routes';

export const resolveDefaultNavBreadcrumbForPathname = (
  pathname: string,
): { label: string; href?: string } | null => {
  if (pathname === HOME_PATH) return { label: 'Dashboard', href: HOME_PATH };
  if (pathname === TRANSACTIONS_PATH || pathname.startsWith('/transaction-detail')) {
    return { label: 'Transactions', href: TRANSACTIONS_PATH };
  }
  if (pathname === RECURRING_PATH || pathname.startsWith('/recurring-purchase-detail')) {
    return { label: 'Recurring', href: RECURRING_PATH };
  }
  if (pathname === BANK_ACCOUNTS_PATH) {
    return { label: 'Bank accounts', href: BANK_ACCOUNTS_PATH };
  }
  if (pathname === CREDIT_CARDS_PATH) {
    return { label: 'Credit cards', href: CREDIT_CARDS_PATH };
  }
  if (pathname === STATEMENT_IMPORTS_PATH || pathname.startsWith('/statement-import-detail')) {
    return { label: 'Imports', href: STATEMENT_IMPORTS_PATH };
  }
  if (pathname === AI_PROMPTS_PATH || pathname.startsWith('/ai-prompt-detail')) {
    return { label: 'AI Prompts', href: AI_PROMPTS_PATH };
  }
  return null;
};
