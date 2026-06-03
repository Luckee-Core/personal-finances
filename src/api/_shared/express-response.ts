import type { ApiErrorCode, ApiResponse } from '@/api/types';

type ExpressBody<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const toErrorCode = (status: number): ApiErrorCode => {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'UNPROCESSABLE_ENTITY';
  if (status === 429) return 'TOO_MANY_REQUESTS';
  if (status >= 500) return 'INTERNAL_SERVER_ERROR';
  return 'BAD_REQUEST';
};

export const apiOk = <T>(data: T, status = 200, message?: string): ApiResponse<T> => ({
  ok: true,
  status,
  data,
  message,
});

export const apiFail = (
  message: string,
  status = 400,
  code?: ApiErrorCode,
  details?: unknown,
): ApiResponse<never> => ({
  ok: false,
  status,
  error: {
    code: code ?? toErrorCode(status),
    message,
    details,
  },
});

export const fromExpressBody = <T>(
  body: ExpressBody<T>,
  fallbackMessage: string,
  status = 200,
): ApiResponse<T> => {
  if (!body.success || body.data === undefined) {
    return apiFail(body.error ?? fallbackMessage, 400);
  }
  return apiOk(body.data, status);
};

export const fromExpressListBody = <T>(
  body: ExpressBody<T[]>,
  fallbackMessage: string,
): ApiResponse<T[]> => {
  if (!body.success) {
    return apiFail(body.error ?? fallbackMessage, 400);
  }
  return apiOk(body.data ?? [], 200);
};

export const fromExpressVoidBody = (
  body: ExpressBody<unknown>,
  fallbackMessage: string,
): ApiResponse<null> => {
  if (!body.success) {
    return apiFail(body.error ?? fallbackMessage, 400);
  }
  return apiOk(null, 200);
};

export const fromCaughtError = (error: unknown, fallbackMessage: string): ApiResponse<never> => {
  const message = error instanceof Error ? error.message : fallbackMessage;
  return apiFail(message, 500, 'INTERNAL_SERVER_ERROR', error);
};
