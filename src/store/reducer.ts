// ADR buckets: dumps/* entity maps, current/* selection, builders/* UI state, filters/* query state.
import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './appSlice';
import {
  bankAccountsReducer,
  creditCardsReducer,
  categoriesReducer,
  transactionsReducer,
  recurringPurchasesReducer,
  anticipatedCostsReducer,
  loansReducer,
  loanVendorsReducer,
  notRecurringReducer,
  statementImportsReducer,
  aiPromptsReducer,
  transactionSlugAssignAiExchangesReducer,
  transactionSlugAssignAiRequestsReducer,
  transactionSlugAssignAiResponsesReducer,
  transactionCategoryAssignAiExchangesReducer,
  transactionCategoryAssignAiRequestsReducer,
  transactionCategoryAssignAiResponsesReducer,
  llmModelsReducer,
  recurringDetectAiExchangesReducer,
} from './dumps';
import {
  currentTransactionReducer,
  currentRecurringPurchaseReducer,
  currentStatementImportReducer,
  currentAiPromptReducer,
} from './current';
import { breadcrumbBuilderReducer, dashboardBuilderReducer } from './builders';
import { transactionFiltersReducer } from './filters';

export const rootReducer = combineReducers({
  app: appReducer,
  bankAccounts: bankAccountsReducer,
  creditCards: creditCardsReducer,
  categories: categoriesReducer,
  transactions: transactionsReducer,
  recurringPurchases: recurringPurchasesReducer,
  anticipatedCosts: anticipatedCostsReducer,
  loans: loansReducer,
  loanVendors: loanVendorsReducer,
  notRecurring: notRecurringReducer,
  statementImports: statementImportsReducer,
  aiPrompts: aiPromptsReducer,
  transactionSlugAssignAiExchanges: transactionSlugAssignAiExchangesReducer,
  transactionSlugAssignAiRequests: transactionSlugAssignAiRequestsReducer,
  transactionSlugAssignAiResponses: transactionSlugAssignAiResponsesReducer,
  transactionCategoryAssignAiExchanges: transactionCategoryAssignAiExchangesReducer,
  transactionCategoryAssignAiRequests: transactionCategoryAssignAiRequestsReducer,
  transactionCategoryAssignAiResponses: transactionCategoryAssignAiResponsesReducer,
  llmModels: llmModelsReducer,
  recurringDetectAiExchanges: recurringDetectAiExchangesReducer,
  currentTransaction: currentTransactionReducer,
  currentRecurringPurchase: currentRecurringPurchaseReducer,
  currentStatementImport: currentStatementImportReducer,
  currentAiPrompt: currentAiPromptReducer,
  breadcrumbBuilder: breadcrumbBuilderReducer,
  dashboardBuilder: dashboardBuilderReducer,
  transactionFilters: transactionFiltersReducer,
});
