/**
 * Minimal runtime validation for environment variables.
 *
 * `serverEnv` is a lazy getter object so that importing this module from a
 * client component (for `publicEnv`) never touches server-only values.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const serverEnv = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get betterAuthSecret() {
    return required("BETTER_AUTH_SECRET");
  },
  get betterAuthUrl() {
    return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  },
};

export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
