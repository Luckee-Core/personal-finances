import type { Metadata } from 'next';
import { ApiDocsView } from '@/packages/api-docs';

export const metadata: Metadata = {
  title: 'API reference — Personal Finances',
  description:
    'HTTP reference for personal-finances-express-server: /api/data CRUD, statement imports, and /api/ai workers.',
};

export default function Page() {
  return <ApiDocsView />;
}
