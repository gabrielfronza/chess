import { createMobileConfig } from './config';

type RequestOptions = {
  signal?: AbortSignal;
};

export type HttpClient = {
  get: <ResponseBody>(
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
      const response = await fetcher(joinUrl(baseUrl, path), {
        method: 'GET',
        signal: options?.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return (await response.json()) as ResponseBody;
    },
  };
}

export const httpClient: HttpClient = {
  get<ResponseBody>(path: string, options?: RequestOptions) {
    return createHttpClient().get(path, options);
  },
};
