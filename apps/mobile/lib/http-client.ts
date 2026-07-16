import { createMobileConfig } from './config';

type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export type HttpClient = {
  delete: <ResponseBody = void>(
    path: string,
    options?: RequestOptions,
  ) => Promise<ResponseBody>;
  get: <ResponseBody>(
    path: string,
    options?: RequestOptions,
  ) => Promise<ResponseBody>;
  post: <ResponseBody>(
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
    async delete<ResponseBody = void>(path: string, options?: RequestOptions) {
      return request<ResponseBody>(baseUrl, path, fetcher, {
        ...options,
        method: 'DELETE',
      });
    },
    async get<ResponseBody>(path: string, options?: RequestOptions) {
      return request<ResponseBody>(baseUrl, path, fetcher, {
        ...options,
        method: 'GET',
      });
    },
    async post<ResponseBody>(path: string, options?: RequestOptions) {
      return request<ResponseBody>(baseUrl, path, fetcher, {
        ...options,
        method: 'POST',
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
  options: RequestOptions & { method: 'DELETE' | 'GET' | 'PATCH' | 'POST' },
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
    throw new HttpError(response.status, await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  return (await response.json()) as ResponseBody;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown };

    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message;
    }
  } catch {
    // The response is not JSON, so use the status-based fallback below.
  }

  return `Request failed with status ${response.status}`;
}

export function createBearerHeaders(
  accessToken: string,
): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export const httpClient: HttpClient = {
  delete<ResponseBody = void>(path: string, options?: RequestOptions) {
    return createHttpClient().delete<ResponseBody>(path, options);
  },
  get<ResponseBody>(path: string, options?: RequestOptions) {
    return createHttpClient().get(path, options);
  },
  post<ResponseBody>(path: string, options?: RequestOptions) {
    return createHttpClient().post(path, options);
  },
  patch<ResponseBody>(path: string, options?: RequestOptions) {
    return createHttpClient().patch(path, options);
  },
};
