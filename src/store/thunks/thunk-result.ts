import type { ThunkStatus } from '@/api/types';

export type ThunkResult =
  | {
      status: 200;
      message?: string;
      entityId?: string;
      batchProcessed?: number;
      batchRemaining?: number;
      batchTotalMatching?: number;
    }
  | { status: Exclude<ThunkStatus, 200>; message: string };
