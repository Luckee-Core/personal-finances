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
import type { ThunkStatus } from '@/api/types';

/**
 * Loads all bootstrap entity dumps from the API.
 */
export const loadBootstrapDataThunk =
  (): AppThunk<Promise<ThunkStatus>> =>
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

    let status: ThunkStatus = 200;

    if (bankAccounts.ok) {
      dispatch(BankAccountsActions.setBankAccounts(rowsToEntityRecord(bankAccounts.data)));
    } else {
      status = 400;
    }

    if (creditCards.ok) {
      dispatch(CreditCardsActions.setCreditCards(rowsToEntityRecord(creditCards.data)));
    } else {
      status = 400;
    }

    if (categories.ok) {
      dispatch(CategoriesActions.setCategories(rowsToEntityRecord(categories.data)));
    } else {
      status = 400;
    }

    if (transactions.ok) {
      dispatch(TransactionsActions.setTransactions(rowsToEntityRecord(transactions.data)));
    } else {
      status = 400;
    }

    if (recurring.ok) {
      dispatch(RecurringPurchasesActions.setRecurringPurchases(rowsToEntityRecord(recurring.data)));
    } else {
      status = 400;
    }

    if (anticipated.ok) {
      dispatch(
        AnticipatedCostsActions.setAnticipatedCosts(rowsToEntityRecord(anticipated.data)),
      );
    } else {
      status = 400;
    }

    if (loans.ok) {
      dispatch(LoansActions.setLoans(rowsToEntityRecord(loans.data)));
    } else {
      status = 400;
    }

    if (loanVendors.ok) {
      dispatch(LoanVendorsActions.setLoanVendors(rowsToEntityRecord(loanVendors.data)));
    } else {
      status = 400;
    }

    if (notRecurring.ok) {
      dispatch(NotRecurringActions.setNotRecurring(rowsToEntityRecord(notRecurring.data)));
    } else {
      status = 400;
    }

    if (imports.ok) {
      dispatch(StatementImportsActions.setStatementImports(rowsToEntityRecord(imports.data)));
    } else {
      status = 400;
    }

    if (llmModels.ok) {
      dispatch(LlmModelsActions.setLlmModels(llmModels.data));
    } else {
      status = 400;
    }

    if (slugExchanges.ok) {
      dispatch(
        TransactionSlugAssignAiExchangesActions.setTransactionSlugAssignAiExchanges(
          rowsToEntityRecord(slugExchanges.data),
        ),
      );
    } else {
      status = 400;
    }

    if (categoryExchanges.ok) {
      dispatch(
        TransactionCategoryAssignAiExchangesActions.setTransactionCategoryAssignAiExchanges(
          rowsToEntityRecord(categoryExchanges.data),
        ),
      );
    } else {
      status = 400;
    }

    if (recurringExchanges.ok) {
      dispatch(
        RecurringDetectAiExchangesActions.setRecurringDetectAiExchanges(
          rowsToEntityRecord(recurringExchanges.data),
        ),
      );
    } else {
      status = 400;
    }

    return status;
  };
