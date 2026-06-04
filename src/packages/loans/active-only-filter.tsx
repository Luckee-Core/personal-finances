'use client';

type Props = {
  hideInactive: boolean;
  onHideInactiveChange: (hide: boolean) => void;
};

export const LoansActiveOnlyFilter = ({ hideInactive, onHideInactiveChange }: Props) => (
  <label className={styles.label}>
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={hideInactive}
      onChange={(e) => onHideInactiveChange(e.target.checked)}
    />
    <span>Hide inactive</span>
  </label>
);

const styles = {
  label: `flex items-center gap-2 text-sm text-gray-700 cursor-pointer`,
  checkbox: `h-4 w-4 rounded border-gray-300`,
} as const;
