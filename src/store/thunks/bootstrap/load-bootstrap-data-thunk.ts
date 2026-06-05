import {
  getAllRecurringDetectAiExchanges,
  getAllTransactionCategoryAssignAiExchanges,
  getAllTransactionSlugAssignAiExchanges,
} from '@/api/ai-exchanges';
import { getAllBankAccounts } from '@/api/bank-accounts';
import { getAllCreditCards } from '@/api/credit-cards';
import { getAllCategories } from '@/api/categories';
import { getAllLlmModels } from '@/api/llm-models';
import { getAllAnticipatedCosts } from '@/api/anticipated-costs';
import { getAllLoanVendors } from '@/api/loan-vendors';
import { getAllLoans } from '@/api/loans';
import { getAllNotRecurring } from '@/api/not-recurring';
import { getAllRecurringPurchases } from '@/api/recurring-purchases';
import { getAllStatementImports } from '@/api/statement-imports';
import { getAllTransactions } from '@/api/transactions';
import {
  BankAccountsActions,
  CreditCardsActions,
  CategoriesActions,
  LlmModelsActions,
  RecurringDetectAiExchangesActions,
  AnticipatedCostsActions,
  LoansActions,
  LoanVendorsActions,
  NotRecurringActions,
  RecurringPurchasesActions,
  StatementImportsActions,
  TransactionCategoryAssignAiExchangesActions,
  TransactionSlugAssignAiExchangesActions,
  TransactionsActions,
} from '@/store/dumps';
import { rowsToEntityRecord } from '@/store/normalize';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Loads all bootstrap entity dumps from the API.
 */
export const loadBootstrapDataThunk =
  (): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const [
      bankAccounts,
      creditCards,
      categories,
      transactions,
      recurring,
      anticipated,
      loans,
      loanVendors,
      notRecurring,
      imports,
      llmModels,
      slugExchanges,
      categoryExchanges,
      recurringExchanges,
    ] = await Promise.all([
      getAllBankAccounts(),
      getAllCreditCards(),
      getAllCategories(),
      getAllTransactions(),
      getAllRecurringPurchases(),
      getAllAnticipatedCosts(),
      getAllLoans(),
      getAllLoanVendors(),
      getAllNotRecurring(),
      getAllStatementImports(),
      getAllLlmModels(),
      getAllTransactionSlugAssignAiExchanges(),
      getAllTransactionCategoryAssignAiExchanges(),
      getAllRecurringDetectAiExchanges(),
    ]);

    let failed = false;

    if (bankAccounts.ok) {
      dispatch(BankAccountsActions.setBankAccounts(rowsToEntityRecord(bankAccounts.data)));
    } else {
      failed = true;
    }

    if (creditCards.ok) {
      dispatch(CreditCardsActions.setCreditCards(rowsToEntityRecord(creditCards.data)));
    } else {
      failed = true;
    }

    if (categories.ok) {
      dispatch(CategoriesActions.setCategories(rowsToEntityRecord(categories.data)));
    } else {
      failed = true;
    }

    if (transactions.ok) {
      dispatch(TransactionsActions.setTransactions(rowsToEntityRecord(transactions.data)));
    } else {
      failed = true;
    }

    if (recurring.ok) {
      dispatch(RecurringPurchasesActions.setRecurringPurchases(rowsToEntityRecord(recurring.data)));
    } else {
      failed = true;
    }

    if (anticipated.ok) {
      dispatch(
        AnticipatedCostsActions.setAnticipatedCosts(rowsToEntityRecord(anticipated.data)),
      );
    } else {
      failed = true;
    }

    if (loans.ok) {
      dispatch(LoansActions.setLoans(rowsToEntityRecord(loans.data)));
    } else {
      failed = true;
    }

    if (loanVendors.ok) {
      dispatch(LoanVendorsActions.setLoanVendors(rowsToEntityRecord(loanVendors.data)));
    } else {
      failed = true;
    }

    if (notRecurring.ok) {
      dispatch(NotRecurringActions.setNotRecurring(rowsToEntityRecord(notRecurring.data)));
    } else {
      failed = true;
    }

    if (imports.ok) {
      dispatch(StatementImportsActions.setStatementImports(rowsToEntityRecord(imports.data)));
    } else {
      failed = true;
    }

    if (llmModels.ok) {
      dispatch(LlmModelsActions.setLlmModels(llmModels.data));
    } else {
      failed = true;
    }

    if (slugExchanges.ok) {
      dispatch(
        TransactionSlugAssignAiExchangesActions.setTransactionSlugAssignAiExchanges(
          rowsToEntityRecord(slugExchanges.data),
        ),
      );
    } else {
      failed = true;
    }

    if (categoryExchanges.ok) {
      dispatch(
        TransactionCategoryAssignAiExchangesActions.setTransactionCategoryAssignAiExchanges(
          rowsToEntityRecord(categoryExchanges.data),
        ),
      );
    } else {
      failed = true;
    }

    if (recurringExchanges.ok) {
      dispatch(
        RecurringDetectAiExchangesActions.setRecurringDetectAiExchanges(
          rowsToEntityRecord(recurringExchanges.data),
        ),
      );
    } else {
      failed = true;
    }

    if (failed) {
      return { status: 400, message: 'Failed to load one or more bootstrap datasets' };
    }

    return { status: 200 };
  };
