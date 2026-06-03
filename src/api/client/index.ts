import { API_CONFIG } from '@/config/api';

type ApiClient = {
  get: <T = unknown>(url: string, config?: { params?: Record<string, unknown> }) => Promise<{ data: T }>;
  post: <T = unknown>(url: string, data?: unknown) => Promise<{ data: T }>;
  postFormData: <T = unknown>(url: string, formData: FormData) => Promise<{ data: T }>;
  patch: <T = unknown>(url: string, data?: unknown) => Promise<{ data: T }>;
  delete: <T = unknown>(url: string) => Promise<{ data: T }>;
};

const pickErrorText = (errorData: Record<string, unknown>): string => {
  const topError = errorData.error;
  if (typeof topError === 'string' && topError.trim()) return topError.trim();
  const msg = errorData.message;
  if (typeof msg === 'string' && msg.trim()) return msg.trim();
  return '';
};

const handleResponse = async <T>(response: Response, url: string): Promise<{ data: T }> => {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const text = pickErrorText(errorData);
    throw new Error(text || `Request failed: ${response.statusText}`);
  }
  const data = (await response.json().catch(() => ({}))) as T;
  return { data };
};

const createApiClient = (): ApiClient => {
  const baseURL = API_CONFIG.SERVER_URL;

  const request = async <T>(
    url: string,
    init: RequestInit,
  ): Promise<{ data: T }> => {
    const fullUrl = `${baseURL}${url}`;
    const response = await fetch(fullUrl, init);
    return handleResponse<T>(response, fullUrl);
  };

  return {
    get: async <T>(url: string, config?: { params?: Record<string, unknown> }) => {
      let fullUrl = url;
      if (config?.params) {
        const params = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) fullUrl += `?${queryString}`;
      }
      return request<T>(fullUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    },
    post: async <T>(url: string, data?: unknown) =>
      request<T>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      }),
    postFormData: async <T>(url: string, formData: FormData) =>
      request<T>(url, { method: 'POST', body: formData }),
    patch: async <T>(url: string, data?: unknown) =>
      request<T>(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: async <T>(url: string) =>
      request<T>(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }),
  };
};

let client: ApiClient | null = null;

export const getApiClient = (): ApiClient => {
  if (!client) client = createApiClient();
  return client;
};
