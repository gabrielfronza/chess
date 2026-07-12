export type MobileConfig = {
  apiBaseUrl: string;
};

export function createMobileConfig(
  environment: Record<string, string | undefined> = process.env,
): MobileConfig {
  const apiBaseUrl = environment.EXPO_PUBLIC_API_URL?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      'Missing required environment variable: EXPO_PUBLIC_API_URL',
    );
  }

  return { apiBaseUrl };
}
