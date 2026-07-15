import { createMobileConfig } from './config';

type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type HttpClient = {
  get: <ResponseBody>(
    path: string,
    options?: RequestOptions,
  ) => Promise<ResponseBody>;
  patch: <ResponseBody>(
    path: string,
    options?: RequestOptions,
  ) => Promise<ResponseBody>;
};

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function createHttpClient(
  baseUrl: string = createMobileConfig().apiBaseUrl,
  fetcher: typeof fetch = fetch,
): HttpClient {
  return {
    async get<ResponseBody>(path: string, options?: RequestOptions) {
      return request<ResponseBody>(baseUrl, path, fetcher, {
        ...options,
        method: 'GET',
      });
    },
    async patch<ResponseBody>(path: string, options?: RequestOptions) {
      return request<ResponseBody>(baseUrl, path, fetcher, {
        ...options,
        method: 'PATCH',
      });
    },
  };
}

async function request<ResponseBody>(
  baseUrl: string,
  path: string,
  fetcher: typeof fetch,
  options: RequestOptions & { method: 'GET' | 'PATCH' },
): Promise<ResponseBody> {
  const response = await fetcher(joinUrl(baseUrl, path), {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    method: options.method,
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as ResponseBody;
}

export function createBearerHeaders(
  accessToken: string,
): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export const httpClient: HttpClient = {
  get<ResponseBody>(path: string, options?: RequestOptions) {
    return createHttpClient().get(path, options);
  },
  patch<ResponseBody>(path: string, options?: RequestOptions) {
    return createHttpClient().patch(path, options);
  },
};
