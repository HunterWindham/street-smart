'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import LocationHeader from '@/components/LocationHeader';
import LocationScores from '@/components/LocationScores';
import Map from '@/components/Map';

export default function InsightsPage() {
  const searchParams = useSearchParams();

  const lngParam = searchParams.get('lng');
  const latParam = searchParams.get('lat');

  const {lng, lat } = useMemo(() => {
    const lngVal = lngParam != null ? parseFloat(lngParam) : NaN;
    const latVal = latParam != null ? parseFloat(latParam) : NaN;
    const valid = !Number.isNaN(lngVal) && !Number.isNaN(latVal);
    return {
      lng: valid ? lngVal : 0,
      lat: valid ? latVal : 0,
    };
  }, [lngParam, latParam]);

  return (
    <main className="container mx-auto flex min-h-[calc(75vh-4rem)] max-w-4xl flex-col justify-center px-4 py-8">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <LocationHeader />
        <Map />
        <LocationScores
          lng={lng}
          lat={lat}
        />
      </div>
    </main>
  );
}
