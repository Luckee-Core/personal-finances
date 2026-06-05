'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AI_PROMPT_DETAIL_PATH } from '@/config/routes';
import {
  AI_PROMPT_TYPE_RECURRING_DETECT,
  AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN,
  AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN,
  type AiPrompt,
} from '@/model/ai-prompt';
import {
  DEFAULT_RECURRING_DETECT_PROMPT,
  DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT,
  DEFAULT_TRANSACTION_SLUG_ASSIGN_PROMPT,
} from '@/utils/ai-prompts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  activateAiPromptThunk,
  createAiPromptThunk,
  deleteAiPromptThunk,
  loadAiPromptsThunk,
  setCurrentAiPromptThunk,
} from '@/store/thunks/ai-prompts';

export const AiPromptsPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const byId = useAppSelector((state) => state.aiPrompts);
  const [typeFilter, setTypeFilter] = useState(AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN);
  const [newName, setNewName] = useState('');
  const [makeActive, setMakeActive] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(loadAiPromptsThunk(typeFilter));
  }, [dispatch, typeFilter]);

  const rows = useMemo(() => {
    const list = Object.values(byId) as AiPrompt[];
    return list
      .filter((p) => p.type === typeFilter)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [byId, typeFilter]);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      setMessage('Enter a name for the new version.');
      return;
    }
    setCreating(true);
    setMessage(null);
    const result = await dispatch(
      createAiPromptThunk({
        type: typeFilter,
        name,
        content: {
          systemPrompt:
            typeFilter === AI_PROMPT_TYPE_RECURRING_DETECT
              ? DEFAULT_RECURRING_DETECT_PROMPT
              : typeFilter === AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN
                ? DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT
                : DEFAULT_TRANSACTION_SLUG_ASSIGN_PROMPT,
        },
        makeActive,
      }),
    );
    setCreating(false);
    if (result.status !== 200) {
      setMessage('Could not create prompt version.');
      return;
    }
    setNewName('');
    setMakeActive(false);
    await dispatch(loadAiPromptsThunk(typeFilter));
  };

  const openDetail = (prompt: AiPrompt) => {
    dispatch(setCurrentAiPromptThunk(prompt));
    router.push(AI_PROMPT_DETAIL_PATH);
  };

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>AI Prompts</h1>
        <p className={styles.subtitle}>Versioned prompts for AI-powered transaction workflows.</p>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.label}>
          Type
          <select
            className={styles.select}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value={AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN}>Transaction slug assign</option>
            <option value={AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN}>Transaction category assign</option>
            <option value={AI_PROMPT_TYPE_RECURRING_DETECT}>Recurring detect</option>
          </select>
        </label>
      </div>

      <div className={styles.createRow}>
        <input
          className={styles.input}
          placeholder="New version name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={makeActive}
            onChange={(e) => setMakeActive(e.target.checked)}
          />
          Set active
        </label>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={creating}
          onClick={() => void handleCreate()}
        >
          {creating ? 'Creating…' : 'Create version'}
        </button>
      </div>
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Version</th>
              <th className={styles.th}>Active</th>
              <th className={styles.th}>Updated</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={styles.row}>
                <td className={styles.td}>{row.name}</td>
                <td className={styles.td}>v{row.version}</td>
                <td className={styles.td}>{row.isActive ? 'Yes' : '—'}</td>
                <td className={styles.td}>{new Date(row.updatedAt).toLocaleString()}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button type="button" className={styles.linkButton} onClick={() => openDetail(row)}>
                      Open
                    </button>
                    {!row.isActive && (
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => void dispatch(activateAiPromptThunk(row.id, typeFilter))}
                      >
                        Activate
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.dangerButton}
                      onClick={() => {
                        if (confirm('Delete this prompt version?')) {
                          void dispatch(deleteAiPromptThunk(row.id, typeFilter));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No prompts for this type yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page: `space-y-4`,
  title: `text-2xl font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-600`,
  toolbar: `flex gap-4`,
  label: `flex flex-col gap-1 text-sm text-gray-600`,
  select: `rounded border border-gray-300 px-2 py-1 text-sm`,
  createRow: `flex flex-wrap items-center gap-3`,
  input: `rounded border border-gray-300 px-3 py-1.5 text-sm min-w-[200px]`,
  checkboxLabel: `flex items-center gap-2 text-sm text-gray-700`,
  primaryButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50`,
  message: `text-sm text-red-600`,
  tableWrap: `overflow-hidden rounded-lg border border-gray-200 bg-white`,
  table: `min-w-full text-sm`,
  th: `px-4 py-2 text-left font-medium text-gray-600 bg-gray-50`,
  row: `border-t border-gray-100`,
  td: `px-4 py-2`,
  actions: `flex gap-2`,
  linkButton: `text-sm text-blue-600 hover:underline`,
  dangerButton: `text-sm text-red-600 hover:underline`,
  empty: `px-4 py-8 text-center text-gray-500`,
} as const;
