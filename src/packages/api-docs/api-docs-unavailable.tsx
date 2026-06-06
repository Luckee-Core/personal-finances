type Props = {
  status: number;
};

/**
 * Shown when the Express catalog cannot be loaded (server down or misconfigured).
 */
export const ApiDocsUnavailable = ({ status }: Props) => {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>API documentation unavailable</h1>
      <p className={styles.lead}>
        Could not load the catalog from Express (status {status}). Start{' '}
        <strong>personal-finances-express-server</strong> on port <strong>3011</strong> and set{' '}
        <code className={styles.code}>NEXT_PUBLIC_SERVER_URL=http://localhost:3011</code> in{' '}
        <code className={styles.code}>.env.local</code>.
      </p>
      <p className={styles.hint}>
        See <strong>Getting started</strong> in the sidebar for the full local setup checklist.
      </p>
    </div>
  );
};

const styles = {
  wrap: `
    max-w-2xl
  `,
  title: `
    text-2xl font-semibold text-foreground
  `,
  lead: `
    mt-4 text-muted-foreground
  `,
  code: `
    rounded bg-secondary px-1.5 py-0.5 font-mono text-sm
  `,
  hint: `
    mt-6 text-sm text-muted-foreground
  `,
};
