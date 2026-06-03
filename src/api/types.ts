export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE';

export type ApiResponse<T> =
  | {
      ok: true;
      status: number;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      status: number;
      error: {
        code: ApiErrorCode;
        message: string;
        details?: unknown;
      };
    };

export type ThunkStatus = 200 | 400 | 500;
