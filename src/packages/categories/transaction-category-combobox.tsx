'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { store } from '@/store/store';
import { createCategoryThunk } from '@/store/thunks/categories/create-category-thunk';
import { updateTransactionCategoryThunk } from '@/store/thunks/transactions/update-transaction-category-thunk';
import { getCategoryMenuPlacement } from '@/utils/categories';
import { normalizeCategoryName } from '@/utils/categories';

export type TransactionCategoryComboboxProps = {
  transactionId: string;
  categoryId: string | null;
  disabled?: boolean;
  /** Portal menu for table rows; absolute menu for detail page. */
  usePortal?: boolean;
  onError?: (message: string) => void;
  className?: string;
};

export const TransactionCategoryCombobox = ({
  transactionId,
  categoryId,
  disabled = false,
  usePortal = true,
  onError,
  className,
}: TransactionCategoryComboboxProps) => {
  const dispatch = useAppDispatch();
  const categoriesRecord = useAppSelector((state) => state.categories);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuPortalRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPlacement, setMenuPlacement] = useState<ReturnType<
    typeof getCategoryMenuPlacement
  > | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categoryList = useMemo(
    () => Object.values(categoriesRecord).sort((a, b) => a.name.localeCompare(b.name)),
    [categoriesRecord],
  );

  const selectedName = categoryId ? categoriesRecord[categoryId]?.name ?? '' : '';
  const [query, setQuery] = useState(selectedName);

  useEffect(() => {
    setQuery(selectedName);
  }, [selectedName, transactionId]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuPortalRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    if (!isMenuOpen || !usePortal) {
      setMenuPlacement(null);
      return;
    }

    const updatePlacement = () => {
      const el = containerRef.current;
      if (!el) return;
      setMenuPlacement(getCategoryMenuPlacement(el.getBoundingClientRect()));
    };

    updatePlacement();
    window.addEventListener('scroll', updatePlacement, true);
    window.addEventListener('resize', updatePlacement);
    return () => {
      window.removeEventListener('scroll', updatePlacement, true);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [isMenuOpen, usePortal]);

  const filteredCategories = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return categoryList;
    return categoryList.filter((cat) => cat.name.toLowerCase().includes(trimmed));
  }, [categoryList, query]);

  const canAddCategory =
    query.trim().length > 0 &&
    !categoryList.some(
      (cat) => normalizeCategoryName(cat.name) === normalizeCategoryName(query),
    );

  const assignCategory = async (nextCategoryId: string | null, displayName: string) => {
    setIsSaving(true);
    const result = await dispatch(
      updateTransactionCategoryThunk(transactionId, nextCategoryId),
    );
    setIsSaving(false);
    if (result.status !== 200) {
      onError?.(result.message ?? 'Failed to save category');
      return false;
    }
    setQuery(displayName);
    setIsMenuOpen(false);
    return true;
  };

  const handleSelect = async (nextCategoryId: string | null) => {
    const name = nextCategoryId ? categoriesRecord[nextCategoryId]?.name ?? '' : '';
    await assignCategory(nextCategoryId, name);
  };

  const handleAddCategory = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const existing = categoryList.find(
      (cat) => normalizeCategoryName(cat.name) === normalizeCategoryName(trimmed),
    );
    if (existing) {
      await handleSelect(existing.id);
      return;
    }

    setIsSaving(true);
    const created = await dispatch(createCategoryThunk(trimmed));
    if (created.status !== 200) {
      setIsSaving(false);
      onError?.(created.message ?? 'Failed to create category');
      return;
    }

    const newCat = Object.values(store.getState().categories).find(
      (cat) => normalizeCategoryName(cat.name) === normalizeCategoryName(trimmed),
    );
    setIsSaving(false);

    if (!newCat) {
      onError?.('Category was created but could not be assigned');
      return;
    }

    await assignCategory(newCat.id, newCat.name);
  };

  const menuContent = (
    <>
      <button
        type="button"
        onClick={() => void handleSelect(null)}
        className={styles.menuItem}
      >
        Uncategorized
      </button>
      {filteredCategories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => void handleSelect(cat.id)}
          className={styles.menuItem}
        >
          {cat.name}
        </button>
      ))}
      {canAddCategory && (
        <button
          type="button"
          onClick={() => void handleAddCategory()}
          className={styles.menuItemAdd}
        >
          + Add &quot;{query.trim()}&quot;
        </button>
      )}
    </>
  );

  return (
    <div
      className={`${styles.container} ${className ?? ''}`}
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        value={query}
        disabled={disabled || isSaving}
        onFocus={() => setIsMenuOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsMenuOpen(true);
        }}
        placeholder="Search categories"
        aria-label="Transaction category"
        className={styles.input}
      />
      {isMenuOpen && !usePortal && (
        <div className={styles.menuInline} role="listbox">
          {menuContent}
        </div>
      )}
      {isMenuOpen &&
        usePortal &&
        menuPlacement &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuPortalRef}
            className={styles.menuPortal}
            role="listbox"
            style={{
              position: 'fixed',
              left: menuPlacement.left,
              width: menuPlacement.width,
              maxHeight: menuPlacement.maxHeight,
              ...(menuPlacement.top !== undefined
                ? { top: menuPlacement.top }
                : { bottom: menuPlacement.bottom }),
            }}
          >
            {menuContent}
          </div>,
          document.body,
        )}
    </div>
  );
};

const styles = {
  container: `
    relative w-full min-w-[8rem] max-w-[12rem]
  `,
  input: `
    block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
    focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400
    disabled:opacity-50
  `,
  menuInline: `
    absolute z-20 top-full left-0 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg
    max-h-56 overflow-y-auto
  `,
  menuPortal: `
    z-[100] rounded-md border border-gray-300 bg-white shadow-lg overflow-y-auto
  `,
  menuItem: `
    w-full text-left px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50
    border-none bg-transparent cursor-pointer
  `,
  menuItemAdd: `
    w-full text-left px-2 py-1.5 text-sm text-blue-700 hover:bg-blue-50
    border-none bg-transparent cursor-pointer font-medium
  `,
} as const;
