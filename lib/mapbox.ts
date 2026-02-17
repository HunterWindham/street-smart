/**
 * Single source of truth for the Mapbox access token. Validates at module load
 * so the app fails fast if the token is missing; components just import getMapboxToken().
 */
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  throw new Error(
    'NEXT_PUBLIC_MAPBOX_TOKEN is required. Add it to your .env file.'
  );
}

export function getMapboxToken(): string {
  return MAPBOX_TOKEN as string;
}
