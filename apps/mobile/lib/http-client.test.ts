import {
  createBearerHeaders,
  createHttpClient,
  HttpError,
} from './http-client';

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

  it('sends POST requests', async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValue(createJsonResponse({ created: true }));
    const client = createHttpClient('http://localhost:3000/api/v1', fetcher);

    await expect(
      client.post('/lichess/oauth/start', {
        headers: createBearerHeaders('access-token'),
      }),
    ).resolves.toEqual({ created: true });

    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/lichess/oauth/start',
      {
        body: undefined,
        headers: {
          Authorization: 'Bearer access-token',
        },
        method: 'POST',
        signal: undefined,
      },
    );
  });

  it('supports empty DELETE responses', async () => {
    const fetcher = jest.fn().mockResolvedValue(createJsonResponse(null, 204));
    const client = createHttpClient('http://localhost:3000/api/v1', fetcher);

    await expect(
      client.delete('/lichess/account', {
        headers: createBearerHeaders('access-token'),
      }),
    ).resolves.toBeUndefined();

    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/lichess/account',
      {
        body: undefined,
        headers: {
          Authorization: 'Bearer access-token',
        },
        method: 'DELETE',
        signal: undefined,
      },
    );
  });

  it('throws for non-success responses', async () => {
    const fetcher = jest.fn().mockResolvedValue(createJsonResponse({}, 503));
    const client = createHttpClient('http://localhost:3000/api/v1', fetcher);

    await expect(client.get('/health')).rejects.toThrow(
      'Request failed with status 503',
    );
  });

  it('preserves an API error message and status', async () => {
    const fetcher = jest.fn().mockResolvedValue(
      createJsonResponse(
        {
          message: 'This Lichess account is already linked to another user',
          statusCode: 409,
        },
        409,
      ),
    );
    const client = createHttpClient('http://localhost:3000/api/v1', fetcher);

    const request = client.post('/lichess/oauth/complete');

    await expect(request).rejects.toBeInstanceOf(HttpError);
    await expect(request).rejects.toEqual(
      expect.objectContaining({
        message: 'This Lichess account is already linked to another user',
        status: 409,
      }),
    );
  });
});
