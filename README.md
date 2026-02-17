# StreetSmart

**Live app:** [https://street-smart-vercel.vercel.app/](https://street-smart-vercel.vercel.app/)

Address Insights Webpage Interview Challenge.

---

## What I Built vs. AI Assistance

I used AI mainly as a starting point to move faster: initial scaffolding, feature implementation ideas, and styling. I drove the architecture, scoring logic, and integration with Mapbox; AI helped with boilerplate, README.md, and UI details.

---

## Approach & Project Structure

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Mapbox (Search Box + GL).
- **Flow:** Home page has an address search box. Selecting a result navigates to `/insights?lng=&lat=&...` where the insights page shows a map and location scores.
- **Key pieces:**
  - `app/page.tsx` — Home with search.
  - `app/insights/page.tsx` — Reads `lng`/`lat` from the URL, renders map and scores.
  - `components/AddressSearchBox.tsx` — Mapbox Search Box; on select, pushes query params and routes to `/insights`.
  - `components/Map.tsx` — Mapbox GL map (center/zoom from URL).
  - `components/LocationScores.tsx` — Fetches and displays walking score, driving score, and urban/suburban.
  - `lib/scores.ts` — Scoring logic (see below).
  - `lib/mapbox.ts` — Mapbox token from `NEXT_PUBLIC_MAPBOX_TOKEN`.

**How scoring works:** Scores are based on Point of Intrest(POI) density from the Mapbox Search Box category API. For a given location we query six categories (restaurant, cafe, grocery, school, park, pharmacy) in two Bounding Boxes: **0.5 mi** (walking) and **5 mi** (driving). Each category returns up to 10 results; the max total is 60 per radius. The **walking score** and **driving score** are each `(count / 60) * 100`, capped at 100. **Urban vs. Suburban** is derived from the walking count: if it’s ≥ 75% of the walking cap, we label the area **Urban**, otherwise **Suburban**.

---

## Assumptions & Design Decisions

- **Scope vs. time:** Kept scope tight to best match suggested time limits. Omitted: search history, highlighting nearby amenities on the map, and automated tests.
- **No custom API layer:** All external calls go to Mapbox (search + category APIs). There’s no separate backend or API route; the app talks to Mapbox from the client/Next server as needed, so an extra API layer didn’t add enough value for this project.

---

## Running Locally

1. Clone the repo and install dependencies: `npm install`
2. Add a `.env` (or `.env.local`) with `NEXT_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>`
3. Run `npm run dev` and open the URL shown in the terminal
