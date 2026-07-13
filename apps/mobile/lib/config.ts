export type MobileConfig = {
  apiBaseUrl: string;
  auth0Audience: string;
  auth0ClientId: string;
  auth0Domain: string;
};

export function createMobileConfig(
  environment: Record<string, string | undefined> = process.env,
): MobileConfig {
  const apiBaseUrl = environment.EXPO_PUBLIC_API_URL?.trim();
  const auth0Audience = environment.EXPO_PUBLIC_AUTH0_AUDIENCE?.trim();
  const auth0ClientId = environment.EXPO_PUBLIC_AUTH0_CLIENT_ID?.trim();
  const auth0Domain = environment.EXPO_PUBLIC_AUTH0_DOMAIN?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      'Missing required environment variable: EXPO_PUBLIC_API_URL',
    );
  }

  if (!auth0Audience) {
    throw new Error(
      'Missing required environment variable: EXPO_PUBLIC_AUTH0_AUDIENCE',
    );
  }

  if (!auth0ClientId) {
    throw new Error(
      'Missing required environment variable: EXPO_PUBLIC_AUTH0_CLIENT_ID',
    );
  }

  if (!auth0Domain) {
    throw new Error(
      'Missing required environment variable: EXPO_PUBLIC_AUTH0_DOMAIN',
    );
  }

  return { apiBaseUrl, auth0Audience, auth0ClientId, auth0Domain };
}
