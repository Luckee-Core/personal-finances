type LandingSectionLabelProps = {
  number: string;
  label: string;
  tone?: 'light' | 'dark';
};

export const LandingSectionLabel = ({
  number,
  label,
  tone = 'light',
}: LandingSectionLabelProps) => {
  return (
    <div className={styles.row}>
      <span className={styles.number}>{number}</span>
      <span className={tone === 'dark' ? styles.dotDark : styles.dotLight}>·</span>
      <span className={tone === 'dark' ? styles.labelDark : styles.labelLight}>{label}</span>
    </div>
  );
};

const styles = {
  row: `
    mono-label flex items-center gap-3 text-primary
  `,
  number: `
  `,
  dotLight: `
    text-muted-foreground
  `,
  dotDark: `
    text-white/40
  `,
  labelLight: `
    text-muted-foreground
  `,
  labelDark: `
    text-white/70
  `,
} as const;
