'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCategoryMenuPlacement } from '@/utils/categories';

export type TransactionRowActionsMenuProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onNotRecurring?: () => void;
  triggerAriaLabel?: string;
  busyLabel?: string;
};

export const TransactionRowActionsMenu = ({
  isOpen,
  isDeleting,
  onToggle,
  onEdit,
  onDelete,
  onClose,
  onNotRecurring,
  triggerAriaLabel = 'Row actions',
  busyLabel = 'Deleting…',
}: TransactionRowActionsMenuProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuPortalRef = useRef<HTMLDivElement>(null);
  const [menuPlacement, setMenuPlacement] = useState<ReturnType<
    typeof getCategoryMenuPlacement
  > | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuPortalRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPlacement(null);
      return;
    }

    const updatePlacement = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const base = getCategoryMenuPlacement(rect);
      const menuWidth = Math.max(rect.width, onNotRecurring ? 140 : 112);
      setMenuPlacement({ ...base, left: rect.right - menuWidth, width: menuWidth });
    };

    updatePlacement();
    window.addEventListener('scroll', updatePlacement, true);
    window.addEventListener('resize', updatePlacement);
    return () => {
      window.removeEventListener('scroll', updatePlacement, true);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={triggerAriaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isDeleting}
        onClick={onToggle}
      >
        ⋯
      </button>
      {isOpen &&
        menuPlacement &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuPortalRef}
            className={styles.menuPortal}
            role="menu"
            style={{
              position: 'fixed',
              left: menuPlacement.left,
              width: Math.max(menuPlacement.width, 112),
              maxHeight: menuPlacement.maxHeight,
              ...(menuPlacement.top !== undefined
                ? { top: menuPlacement.top }
                : { bottom: menuPlacement.bottom }),
            }}
          >
            <button type="button" className={styles.menuItem} role="menuitem" onClick={onEdit}>
              Edit
            </button>
            {onNotRecurring && (
              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                disabled={isDeleting}
                onClick={onNotRecurring}
              >
                {isDeleting ? busyLabel : 'Not recurring'}
              </button>
            )}
            <button
              type="button"
              className={styles.menuItemDanger}
              role="menuitem"
              disabled={isDeleting}
              onClick={onDelete}
            >
              {isDeleting ? busyLabel : 'Delete'}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};

const styles = {
  root: `
    relative inline-flex justify-end
  `,
  trigger: `
    rounded px-2 py-1 text-lg leading-none text-gray-600
    hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50
  `,
  menuPortal: `
    z-[100] min-w-[7rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg overflow-y-auto
  `,
  menuItem: `
    block w-full px-3 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50
  `,
  menuItemDanger: `
    block w-full px-3 py-1.5 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-50
  `,
} as const;
