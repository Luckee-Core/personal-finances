'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { computeExchangeCostCents } from '@/utils/costs';

export type AiCostDisplayRow = {
  id: string;
  logicalKey: string;
  createdAt: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
  costCents: number;
  label: string;
};

const isWithinDays = (iso: string, days: number): boolean => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(iso).getTime() >= cutoff;
};

/**
 * Builds AI cost table rows from exchange dumps and llm_models pricing.
 */
export const useAiCostsTableRows = (days: number): AiCostDisplayRow[] => {
  const llmModels = useAppSelector((s) => s.llmModels);
  const transactions = useAppSelector((s) => s.transactions);
  const slugExchanges = useAppSelector((s) => s.transactionSlugAssignAiExchanges);
  const categoryExchanges = useAppSelector((s) => s.transactionCategoryAssignAiExchanges);
  const recurringExchanges = useAppSelector((s) => s.recurringDetectAiExchanges);

  return useMemo(() => {
    const rows: AiCostDisplayRow[] = [];

    for (const ex of Object.values(slugExchanges)) {
      if (
        ex.status !== 'completed' ||
        ex.input_tokens == null ||
        ex.output_tokens == null ||
        !isWithinDays(ex.created_at, days)
      ) {
        continue;
      }
      const txn = transactions[ex.transaction_id];
      rows.push({
        id: ex.id,
        logicalKey: 'transaction_slug_assign',
        createdAt: ex.created_at,
        inputTokens: ex.input_tokens,
        outputTokens: ex.output_tokens,
        modelUsed: ex.model_used ?? '',
        costCents: computeExchangeCostCents(
          ex.input_tokens,
          ex.output_tokens,
          ex.model_used,
          llmModels,
        ),
        label: txn?.description?.trim() || txn?.slug || ex.transaction_id,
      });
    }

    for (const ex of Object.values(categoryExchanges)) {
      if (
        ex.status !== 'completed' ||
        ex.input_tokens == null ||
        ex.output_tokens == null ||
        !isWithinDays(ex.created_at, days)
      ) {
        continue;
      }
      const txn = transactions[ex.transaction_id];
      rows.push({
        id: ex.id,
        logicalKey: 'transaction_category_assign',
        createdAt: ex.created_at,
        inputTokens: ex.input_tokens,
        outputTokens: ex.output_tokens,
        modelUsed: ex.model_used ?? '',
        costCents: computeExchangeCostCents(
          ex.input_tokens,
          ex.output_tokens,
          ex.model_used,
          llmModels,
        ),
        label: txn?.description?.trim() || txn?.slug || ex.transaction_id,
      });
    }

    for (const ex of Object.values(recurringExchanges)) {
      if (
        ex.status !== 'completed' ||
        ex.input_tokens == null ||
        ex.output_tokens == null ||
        !isWithinDays(ex.created_at, days)
      ) {
        continue;
      }
      rows.push({
        id: ex.id,
        logicalKey: 'recurring_detect',
        createdAt: ex.created_at,
        inputTokens: ex.input_tokens,
        outputTokens: ex.output_tokens,
        modelUsed: ex.model_used ?? '',
        costCents: computeExchangeCostCents(
          ex.input_tokens,
          ex.output_tokens,
          ex.model_used,
          llmModels,
        ),
        label: `Recurring · ${ex.slug}`,
      });
    }

    return rows.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [
    slugExchanges,
    categoryExchanges,
    recurringExchanges,
    transactions,
    llmModels,
    days,
  ]);
};
