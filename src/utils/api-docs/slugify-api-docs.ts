/**
 * Slugify a catalog label for use in URL hash anchors.
 */
export const slugifyApiDocs = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
