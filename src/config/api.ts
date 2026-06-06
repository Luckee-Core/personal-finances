export const API_CONFIG = {
  SERVER_URL:
    process.env.NEXT_PUBLIC_SERVER_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://127.0.0.1:3011',
};
