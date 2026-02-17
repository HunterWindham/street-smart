'use client';

import { useEffect, useState } from 'react';
import { fetchScoresForLocation, type LocationScores } from "@/lib/scores";

interface LocationScoresProps {
  lng: number;
  lat: number;
}

const LocationScores = ({ lng, lat }: LocationScoresProps) => {
  const [scores, setScores] = useState<LocationScores | null>(null);
  const [scoresError, setScoresError] = useState<string | null>(null);

  useEffect(() => {
    fetchScoresForLocation(lng, lat)
      .then((data) => {
        setScores(data);
        setScoresError(null);
      })
      .catch((err: Error) => setScoresError(err.message));
  }, [lng, lat]);

  return (
    <section className="mt-4 mb-4">
      {scoresError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Could not load scores: {scoresError}
        </p>
      )}
      {scores == null && !scoresError && (
        <p className="text-sm text-gray-400 dark:text-gray-400">
          Loading…
        </p>
      )}
      {scores != null && (
        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="rounded border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-400">
              Walking score
            </span>
            <span className="mt-1 block text-2xl font-semibold tabular-nums">
              {scores.walkingScore}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-400">
              Based on nearby amenities within ~0.5 mi
            </span>
          </li>
          <li className="rounded border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-400">
              Driving score
            </span>
            <span className="mt-1 block text-2xl font-semibold tabular-nums">
              {scores.drivingScore}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-400">
              Based on amenities within ~5 mi
            </span>
          </li>
          <li className="rounded border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-400">
              Urban / Suburban
            </span>
            <span className="mt-1 block text-2xl font-semibold">
              {scores.urbanSuburban}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-400">
              Based on amenities within ~0.5 mi
            </span>
          </li>
        </ul>
      )}
    </section>
  );
};

export default LocationScores;
