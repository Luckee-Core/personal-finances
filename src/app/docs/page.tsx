import { redirect } from 'next/navigation';
import { DOCS_GETTING_STARTED_PATH } from '@/config/routes';

/** Docs root sends readers to the getting started guide. */
export default function DocsHomePage() {
  redirect(DOCS_GETTING_STARTED_PATH);
}
