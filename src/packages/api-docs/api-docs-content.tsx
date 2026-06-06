import type { ApiDocsCatalog } from '@/api/api-docs';
import { docsArticleStyles } from '@/packages/docs';
import { slugifyApiDocs } from '@/utils/api-docs';
import { EndpointCard } from './endpoint-card';

type Props = {
  catalog: ApiDocsCatalog;
};

const OVERVIEW_GROUP_NAME = 'Overview';

const splitDescriptionParagraphs = (description: string): string[] =>
  description.split(/\n\n+/).filter((paragraph) => paragraph.trim().length > 0);

type GroupDescriptionProps = {
  description: string;
  className: string;
};

const GroupDescription = ({ description, className }: GroupDescriptionProps) => (
  <>
    {splitDescriptionParagraphs(description).map((paragraph) => (
      <p key={paragraph} className={className}>
        {paragraph}
      </p>
    ))}
  </>
);

/**
 * Presentational layout for the API documentation catalog.
 */
export const ApiDocsContent = ({ catalog }: Props) => {
  return (
    <div className={styles.page}>
      {catalog.groups.map((group) => {
        const isOverview = group.name === OVERVIEW_GROUP_NAME;

        return (
          <section
            key={group.name}
            id={`group-${slugifyApiDocs(group.name)}`}
            className={isOverview ? styles.overviewGroup : styles.group}
          >
            {isOverview ? (
              <>
                <h1 className={styles.overviewTitle}>{group.name}</h1>
                <p className={styles.meta}>
                  Version {catalog.version} · Base URL{' '}
                  <code className={styles.code}>{catalog.baseUrl}</code>
                </p>
                <p className={styles.envelope}>
                  Response envelope:{' '}
                  <code className={styles.code}>{catalog.responseEnvelope}</code>
                </p>
                {group.description ? (
                  <GroupDescription
                    description={group.description}
                    className={styles.overviewDesc}
                  />
                ) : null}
              </>
            ) : (
              <>
                <h2 className={styles.groupTitle}>{group.name}</h2>
                {group.description ? (
                  <GroupDescription description={group.description} className={styles.groupDesc} />
                ) : null}
              </>
            )}
            {group.endpoints.length > 0 ? (
              <div className={styles.endpoints}>
                {group.endpoints.map((endpoint) => {
                  const anchorId = `${slugifyApiDocs(group.name)}-${slugifyApiDocs(endpoint.method)}-${slugifyApiDocs(endpoint.path)}`;
                  return (
                    <EndpointCard key={anchorId} endpoint={endpoint} anchorId={anchorId} />
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
};

const styles = {
  page: `max-w-6xl space-y-16`,
  overviewGroup: `
    scroll-mt-8 border-b border-border pb-8
  `,
  overviewTitle: docsArticleStyles.h1,
  meta: `
    mt-3 text-sm text-muted-foreground
  `,
  envelope: `
    mt-2 text-sm text-muted-foreground
  `,
  overviewDesc: `
    mt-4 text-sm text-muted-foreground leading-relaxed
    [&+&]:mt-3
  `,
  code: docsArticleStyles.code,
  group: `
    scroll-mt-8
  `,
  groupTitle: `
    text-2xl font-semibold
  `,
  groupDesc: `
    mt-2 text-sm text-muted-foreground leading-relaxed
    [&+&]:mt-2
  `,
  endpoints: `
    mt-6 space-y-6
  `,
};
