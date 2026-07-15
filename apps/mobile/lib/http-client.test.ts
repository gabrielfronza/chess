import { createBearerHeaders, createHttpClient } from './http-client';

function createJsonResponse(body: unknown, status = 200): Response {
  return {
    json: jest.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  } as unknown as Response;
}

describe('createHttpClient', () => {
  it('joins the base URL and path for GET requests', async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValue(createJsonResponse({ ok: true }));
    const client = createHttpClient('http://localhost:3000/api/v1/', fetcher);

    await expect(client.get('/health')).resolves.toEqual({ ok: true });

    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/health',
      {
        body: undefined,
        headers: {},
        method: 'GET',
        signal: undefined,
      },
    );
  });

  it('sends JSON PATCH requests with custom headers', async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValue(createJsonResponse({ saved: true }));
    const client = createHttpClient('http://localhost:3000/api/v1', fetcher);

    await expect(
      client.patch('/me', {
        body: { displayName: 'Player One' },
        headers: createBearerHeaders('access-token'),
      }),
    ).resolves.toEqual({ saved: true });

    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/v1/me', {
      body: JSON.stringify({ displayName: 'Player One' }),
      headers: {
        Authorization: 'Bearer access-token',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      signal: undefined,
    });
  });

  it('throws for non-success responses', async () => {
    const fetcher = jest.fn().mockResolvedValue(createJsonResponse({}, 503));
    const client = createHttpClient('http://localhost:3000/api/v1', fetcher);

    await expect(client.get('/health')).rejects.toThrow(
      'Request failed with status 503',
    );
  });
});
