'use client';

import { useEffect, useMemo, useState } from 'react';
import { AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN } from '@/model/ai-prompt';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { store } from '@/store/store';
import { loadAiPromptsThunk } from '@/store/thunks/ai-prompts/load-ai-prompts-thunk';
import { reslugTransactionThunk } from '@/store/thunks/transactions/reslug-transaction-thunk';
import {
  getActiveSlugAssignPrompt,
  getSlugAssignSystemPromptText,
} from '@/utils/ai-prompts/get-active-slug-assign-prompt';

export type ReslugFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  scopeLabel: string;
  onComplete?: (message: string | null, error: string | null) => void;
};

export const ReslugFlowModal = ({
  isOpen,
  onClose,
  transactionId,
  scopeLabel,
  onComplete,
}: ReslugFlowModalProps) => {
  const dispatch = useAppDispatch();
  const aiPrompts = useAppSelector((state) => state.aiPrompts);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [baselinePrompt, setBaselinePrompt] = useState('');
  const [savePrompt, setSavePrompt] = useState(true);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePrompt = useMemo(() => getActiveSlugAssignPrompt(aiPrompts), [aiPrompts]);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSavePrompt(true);
    const load = async () => {
      setLoadingPrompt(true);
      await dispatch(loadAiPromptsThunk(AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN));
      const text = getSlugAssignSystemPromptText(store.getState().aiPrompts);
      setSystemPrompt(text);
      setBaselinePrompt(text);
      setLoadingPrompt(false);
    };
    void load();
  }, [isOpen, dispatch]);

  if (!isOpen) {
    return null;
  }

  const promptDirty = systemPrompt.trim() !== baselinePrompt.trim();

  const handleRun = async () => {
    setError(null);
    setRunning(true);
    const result = await dispatch(
      reslugTransactionThunk({
        transactionId,
        systemPrompt,
        savePrompt: savePrompt && promptDirty,
        usePromptOverride: promptDirty && !savePrompt,
      }),
    );
    setRunning(false);
    if (result.status !== 200) {
      setError(result.message ?? 'Re-slug failed');
      onComplete?.(null, result.message ?? 'Re-slug failed');
      return;
    }
    onComplete?.(result.message ?? null, null);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="reslug-title">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <h2 id="reslug-title" className={styles.title}>
              Re-slug
            </h2>
            <p className={styles.subtitle}>{scopeLabel}</p>
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
          The model sees <strong>bank_account_name</strong> and the description. Re-slug before
          Re-categorize when a slug names the wrong bank (e.g. pnc-* on a TD account).
        </p>

        <label className={styles.label}>
          System prompt
          <textarea
            className={styles.textarea}
            rows={12}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            disabled={loadingPrompt || running}
          />
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={savePrompt}
            onChange={(e) => setSavePrompt(e.target.checked)}
            disabled={!promptDirty || running}
          />
          Save prompt to active version before re-slugging
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={running}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={running || loadingPrompt || !systemPrompt.trim()}
            onClick={() => void handleRun()}
          >
            {running ? 'Re-slugging…' : 'Re-slug'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4`,
  panel: `flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-lg`,
  header: `flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4`,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `mt-0.5 text-sm text-gray-600`,
  meta: `mt-1 text-xs text-gray-500`,
  closeButton: `text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50`,
  help: `px-5 pt-3 text-sm text-gray-600`,
  label: `flex flex-col gap-1 px-5 pt-3 text-sm font-medium text-gray-700`,
  textarea: `w-full resize-y rounded-md border border-gray-300 px-3 py-2 font-mono text-xs text-gray-900 focus:border-gray-500 focus:outline-none disabled:bg-gray-50`,
  checkboxLabel: `flex items-center gap-2 px-5 pt-3 text-sm text-gray-700`,
  error: `px-5 pt-2 text-sm text-red-600`,
  footer: `mt-2 flex justify-end gap-2 border-t border-gray-100 px-5 py-4`,
  primaryButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50`,
  secondaryButton: `rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50`,
} as const;
