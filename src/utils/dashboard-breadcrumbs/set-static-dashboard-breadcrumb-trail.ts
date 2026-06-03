import type { AppLayoutBreadcrumb } from '@/components/app-layout-header';
import type { BreadcrumbSegment } from '@/model/breadcrumb';
import { BreadcrumbBuilderActions } from '@/store/builders';
import type { AppDispatch } from '@/store/store';

const toSegments = (legacy: AppLayoutBreadcrumb[]): BreadcrumbSegment[] =>
  legacy.map((item) =>
    item.href
      ? { kind: 'staticLink', label: item.label, href: item.href }
      : { kind: 'plainText', label: item.label },
  );

export const setStaticDashboardBreadcrumbTrail = (
  dispatch: AppDispatch,
  legacyBreadcrumbs: AppLayoutBreadcrumb[],
): void => {
  dispatch(
    BreadcrumbBuilderActions.setTrail({
      base: null,
      segments: toSegments(legacyBreadcrumbs),
    }),
  );
};

export const resetDashboardBreadcrumbTrail = (dispatch: AppDispatch): void => {
  dispatch(BreadcrumbBuilderActions.reset());
};
