/**
 * Shared typography for prose documentation pages.
 */
export const docsArticleStyles = {
  article: `max-w-2xl`,
  articleWide: `max-w-4xl`,
  h1: `text-3xl font-bold tracking-tight text-foreground`,
  lead: `mt-3 text-muted-foreground leading-relaxed`,
  section: `mt-10`,
  h2: `text-lg font-semibold text-foreground`,
  p: `mt-3 text-sm text-muted-foreground leading-relaxed`,
  ol: `mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground`,
  ul: `mt-3 list-disc space-y-2 pl-5 text-sm text-foreground`,
  li: `leading-relaxed`,
  link: `text-primary font-medium underline-offset-4 hover:underline`,
  code: `rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground`,
  codeBlock: `
    mt-3 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4
    font-mono text-xs leading-relaxed text-foreground whitespace-pre
  `,
  table: `mt-4 w-full text-left text-sm`,
  th: `border-b border-border pb-2 pr-4 font-semibold text-foreground`,
  td: `border-b border-border py-2 pr-4 text-muted-foreground align-top`,
};
