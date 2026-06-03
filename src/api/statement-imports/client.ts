import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { StatementImport } from '@/model/statement-import';

type ListBody = { success: boolean; data?: StatementImport[]; error?: string };
type UploadBody = {
  success: boolean;
  data?: {
    import: StatementImport;
    createdCount: number;
    skippedCount: number;
    errors: string[];
  };
  error?: string;
};

export type UploadStatementImportResult = {
  import: StatementImport;
  createdCount: number;
  skippedCount: number;
  errors: string[];
};

/**
 * Loads all statement imports.
 */
export const getAllStatementImports = async (): Promise<ApiResponse<StatementImport[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/statement-imports');
    return fromExpressListBody(data, 'Failed to load statement imports');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load statement imports');
  }
};

export type UploadStatementImportTarget =
  | { type: 'bank'; id: string }
  | { type: 'credit_card'; id: string };

/**
 * Uploads a CSV statement for a bank account or credit card.
 */
export const uploadStatementImport = async (
  file: File,
  target: UploadStatementImportTarget,
): Promise<ApiResponse<UploadStatementImportResult>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (target.type === 'bank') {
      formData.append('bank_account_id', target.id);
    } else {
      formData.append('credit_card_id', target.id);
    }
    const { data } = await getApiClient().postFormData<UploadBody>(
      '/api/data/statement-imports',
      formData,
    );
    return fromExpressBody(data, 'Failed to upload statement');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to upload statement');
  }
};
