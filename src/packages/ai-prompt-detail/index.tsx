'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AI_PROMPTS_PATH } from '@/config/routes';
import {
  AI_PROMPT_TYPE_RECURRING_DETECT,
  AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN,
  AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN,
} from '@/model/ai-prompt';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadAiPromptDetailThunk } from '@/store/thunks/ai-prompts/load-ai-prompt-detail-thunk';
import { saveAiPromptThunk } from '@/store/thunks/ai-prompts/save-ai-prompt-thunk';
import { CurrentAiPromptActions } from '@/store/current';

export const AiPromptDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const prompt = useAppSelector((state) => state.currentAiPrompt);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prompt?.id) {
      void dispatch(loadAiPromptDetailThunk(prompt.id));
    }
  }, [dispatch, prompt?.id]);

  useEffect(() => {
    if (prompt?.content?.systemPrompt !== undefined) {
      setSystemPrompt(prompt.content.systemPrompt ?? '');
    }
  }, [prompt?.content?.systemPrompt, prompt?.id]);

  if (!prompt) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>No prompt selected.</p>
        <button type="button" className={styles.linkButton} onClick={() => router.push(AI_PROMPTS_PATH)}>
          Back to AI prompts
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    dispatch(
      CurrentAiPromptActions.patchCurrentAiPrompt({
        content: { systemPrompt },
      }),
    );
    const result = await dispatch(
      saveAiPromptThunk({
        content: { systemPrompt },
      }),
    );
    setSaving(false);
    if (result.status !== 200) {
      setError(result.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{prompt.name}</h1>
          <p className={styles.meta}>
            {prompt.type} · v{prompt.version}
            {prompt.isActive ? ' · Active' : ''}
          </p>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={() => router.push(AI_PROMPTS_PATH)}>
          Back to list
        </button>
      </div>

      {(prompt.type === AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN ||
        prompt.type === AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN ||
        prompt.type === AI_PROMPT_TYPE_RECURRING_DETECT) && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="system-prompt">
            System prompt
          </label>
          <textarea
            id="system-prompt"
            className={styles.textarea}
            rows={16}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="button"
        className={styles.primaryButton}
        disabled={saving}
        onClick={() => void handleSave()}
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
};

const styles = {
  page: `space-y-4 max-w-3xl`,
  header: `flex items-start justify-between gap-4`,
  title: `text-2xl font-semibold text-gray-900`,
  meta: `text-sm text-gray-600 mt-1`,
  field: `space-y-2`,
  label: `text-sm font-medium text-gray-700`,
  textarea: `w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono`,
  primaryButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50`,
  secondaryButton: `rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800`,
  linkButton: `text-sm text-blue-600 hover:underline`,
  empty: `text-gray-600`,
  error: `text-sm text-red-600`,
} as const;
