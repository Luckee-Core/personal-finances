'use client';

import { useEffect, useMemo, useState } from 'react';
import { AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN } from '@/model/ai-prompt';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadAiPromptsThunk } from '@/store/thunks/ai-prompts';
import { categorizeTransactionsThunk } from '@/store/thunks/transactions';
import { DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT } from '@/utils/ai-prompts';
import {
  getActiveCategoryAssignPrompt,
  getCategoryAssignSystemPromptText,
} from '@/utils/ai-prompts';

export type RecategorizeFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scopeLabel: string;
  onComplete?: (message: string | null, error: string | null) => void;
  /** When set, assign only these transactions. */
  transactionIds?: string[];
  /** With transactionIds: re-assign even when categorized (default true). */
  forceAssign?: boolean;
  /** Run AI category assign on every transaction (prompt modal). */
  categorizeAll?: boolean;
};

export const RecategorizeFlowModal = ({
  isOpen,
  onClose,
  scopeLabel,
  onComplete,
  transactionIds = [],
  forceAssign = true,
  categorizeAll = false,
}: RecategorizeFlowModalProps) => {
  const dispatch = useAppDispatch();
  const aiPrompts = useAppSelector((state) => state.aiPrompts);
  const transactions = useAppSelector((state) => state.transactions);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [savePrompt, setSavePrompt] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePrompt = useMemo(
    () => getActiveCategoryAssignPrompt(aiPrompts),
    [aiPrompts],
  );

  const fixedIds = transactionIds;
  const isFixedSelection = fixedIds.length > 0;
  const isCategorizeAll = categorizeAll && !isFixedSelection;
  const isCategorizeUncategorized = isFixedSelection && !forceAssign;

  const idsToAssign = useMemo(() => {
    if (!isFixedSelection) return [];
    if (forceAssign) return fixedIds;
    return fixedIds.filter((id) => !transactions[id]?.category_id);
  }, [fixedIds, forceAssign, isFixedSelection, transactions]);

  const transactionCount = useMemo(() => {
    if (isFixedSelection) return idsToAssign.length;
    return Object.values(transactions).length;
  }, [transactions, idsToAssign.length, isFixedSelection]);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSavePrompt(false);
    setSystemPrompt(DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT);
    void dispatch(loadAiPromptsThunk(AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN));
  }, [isOpen, dispatch]);

  const loadSavedPrompt = () => {
    setSystemPrompt(getCategoryAssignSystemPromptText(aiPrompts));
  };

  if (!isOpen) {
    return null;
  }

  const title = isCategorizeAll
    ? 'Categorize all'
    : isCategorizeUncategorized
      ? 'Categorize uncategorized'
      : 'Re-categorize';
  const canRun =
    systemPrompt.trim().length > 0 && (isCategorizeAll || idsToAssign.length > 0);

  const handleRun = async () => {
    setError(null);
    setRunning(true);
    const result = await dispatch(
      categorizeTransactionsThunk(
        isFixedSelection
          ? {
              transactionIds: idsToAssign,
              systemPrompt,
              savePrompt,
              force: forceAssign,
            }
          : {
              systemPrompt,
              savePrompt,
              includeAll: true,
            },
      ),
    );
    setRunning(false);
    if (result.status !== 200) {
      setError(result.message ?? `${title} failed`);
      onComplete?.(null, result.message ?? `${title} failed`);
      return;
    }
    onComplete?.(result.message ?? null, null);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="recat-title">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <h2 id="recat-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.subtitle}>
              {transactionCount} transaction{transactionCount === 1 ? '' : 's'} · {scopeLabel}
            </p>
            {activePrompt && (
              <p className={styles.meta}>
                Prompt: {activePrompt.name} · v{activePrompt.version}
              </p>
            )}
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} disabled={running}>
            Close
          </button>
        </div>

        <p className={styles.help}>
          Uses the prompt below (app default), not the old saved DB prompt, unless you click Load
          saved. Memo text only — slug is not sent.
          {isCategorizeAll
            ? ' Assigns or re-assigns every transaction using the bank memo.'
            : isCategorizeUncategorized
              ? ' Assigns a category to each selected transaction that has none yet.'
              : ' Force re-assigns each selected transaction.'}
        </p>
        <button type="button" className={styles.linkButton} onClick={loadSavedPrompt}>
          Load saved active prompt
        </button>

        <label className={styles.label}>
          System prompt
          <textarea
            className={styles.textarea}
            rows={14}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            disabled={running}
          />
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={savePrompt}
            onChange={(e) => setSavePrompt(e.target.checked)}
            disabled={running}
          />
          Save prompt to active version before running
        </label>
        {savePrompt && (
          <p className={styles.hint}>Also updates the saved prompt in Settings → AI Prompts.</p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={running}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={running || !canRun || transactionCount === 0}
            onClick={() => void handleRun()}
          >
            {running ? `${title}…` : title}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4
  `,
  panel: `
    flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-lg bg-white shadow-lg
  `,
  header: `
    flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  subtitle: `
    mt-0.5 text-sm text-gray-600
  `,
  meta: `
    mt-1 text-xs text-gray-500
  `,
  closeButton: `
    text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50
  `,
  help: `
    px-5 pt-3 text-sm text-gray-600
  `,
  label: `
    flex flex-col gap-1 px-5 pt-3 text-sm font-medium text-gray-700
  `,
  textarea: `
    w-full resize-y rounded-md border border-gray-300 px-3 py-2 font-mono text-xs text-gray-900
    focus:border-gray-500 focus:outline-none disabled:bg-gray-50
  `,
  checkboxLabel: `
    flex items-center gap-2 px-5 pt-3 text-sm text-gray-700
  `,
  hint: `
    px-5 text-xs text-gray-500
  `,
  error: `
    px-5 pt-2 text-sm text-red-600
  `,
  footer: `
    flex justify-end gap-2 border-t border-gray-100 px-5 py-4 mt-2
  `,
  primaryButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50
  `,
  secondaryButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800
    hover:bg-gray-50 disabled:opacity-50
  `,
  linkButton: `
    mx-5 mb-1 text-left text-sm text-gray-600 underline hover:text-gray-900
  `,
} as const;
