export const normalizeCategoryName = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '');
