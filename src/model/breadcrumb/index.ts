export type BreadcrumbTrailBase = {
  sectionLabel: string;
  sectionHref?: string;
};

export type BreadcrumbSegment =
  | { kind: 'staticLink'; label: string; href: string }
  | { kind: 'plainText'; label: string };
