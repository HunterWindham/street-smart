import { getMapboxToken } from "@/lib/mapbox";

export interface LocationScores {
  walkingScore: number;
  drivingScore: number;
  urbanSuburban: string;
}

interface MapboxCategoryResponse {
  type: string;
  features?: unknown[];
}

const MILES_PER_DEG = 69; // Approximation for 1 degree lat/long to miles
const WALK_RADIUS_MILES = 0.5;
const DRIVE_RADIUS_MILES = 5;
const MAPBOX_CATEGORY_BASE_URL = "https://api.mapbox.com/search/searchbox/v1/category";
const LIMIT_PER_CATEGORY = 10; // 10 is the limit in mapbox searchbox api
const AMENITY_CATEGORIES = [
  "restaurant",
  "cafe",
  "grocery",
  "school",
  "park",
  "pharmacy",
];
const POI_CAP = AMENITY_CATEGORIES.length * LIMIT_PER_CATEGORY;


function scoreFromPoiCount(count: number): number {
  return Math.round((count / POI_CAP) * 100);
}

function bboxFromCenter(lng: number, lat: number, radiusMiles: number): string {
  const degOffset = radiusMiles / MILES_PER_DEG;
  return [lng - degOffset, lat - degOffset, lng + degOffset, lat + degOffset].join(",");
}

async function fetchCategoryCount(
  category: string,
  bbox: string,
  proximity: string,
  accessToken: string
): Promise<number> {
  const url = new URL(`${MAPBOX_CATEGORY_BASE_URL}/${encodeURIComponent(category)}`);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("bbox", bbox);
  url.searchParams.set("proximity", proximity);
  url.searchParams.set("limit", String(LIMIT_PER_CATEGORY));
  url.searchParams.set("country", "US");

  const res = await fetch(url.toString());
  if (!res.ok) return 0;
  const data = (await res.json()) as MapboxCategoryResponse;
  return Array.isArray(data.features) ? data.features.length : 0;
}

async function totalPoiCountInBbox(
  bbox: string,
  proximity: string,
  token: string
): Promise<number> {
  const counts = await Promise.all(
    AMENITY_CATEGORIES.map((cat) => fetchCategoryCount(cat, bbox, proximity, token))
  );
  return counts.reduce((a, b) => a + b, 0);
}

export async function fetchScoresForLocation(
  lng: number,
  lat: number,
): Promise<LocationScores> {
  const token = getMapboxToken();
  const proximity = `${lng},${lat}`;
  const [walkingPoiCount, drivingPoiCount] = await Promise.all([
    totalPoiCountInBbox(bboxFromCenter(lng, lat, WALK_RADIUS_MILES), proximity, token),
    totalPoiCountInBbox(bboxFromCenter(lng, lat, DRIVE_RADIUS_MILES), proximity, token),
  ]);

  const walkingScore = scoreFromPoiCount(walkingPoiCount);
  const drivingScore = scoreFromPoiCount(drivingPoiCount);
  const urbanSuburban = walkingPoiCount >= (POI_CAP * 0.75) ? "Urban" : "Suburban";

  return {
    walkingScore,
    drivingScore,
    urbanSuburban
  };
}
