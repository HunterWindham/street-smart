'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

const LocationHeader = () => {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const locationDetails = useMemo(() => {
    const placeName = searchParams.get('place_name') ?? null;
    const city = searchParams.get('city') ?? null;
    const state = searchParams.get('state') ?? null;
    const zip = searchParams.get('zip') ?? null;
    const cityStateZip = [city, state, zip]
      .filter(Boolean)
      .join(', ');
    return { placeName, cityStateZip };
  }, [searchParams]);

  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  if (!locationDetails.placeName && !locationDetails.cityStateZip) return null;

  return (
    <div className="mb-4 flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          {locationDetails.placeName && (
            <h2 className="text-2xl font-semibold" data-testid="place-name">
              {locationDetails.placeName}
            </h2>
          )}
          {locationDetails.cityStateZip && (
            <p className="text-base text-gray-400" data-testid="location-details">
              {locationDetails.cityStateZip}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="shrink-0 rounded-lg border border-gray-500 px-3 py-2 text-sm hover:border-gray-400 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-950"
          aria-label={copied ? 'Link copied' : 'Copy link to share'}
          data-testid="share-button"
        >
          {copied ? (
            <span className="text-sm font-medium">Copied!</span>
          ) : (
            'Copy Link'
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationHeader;
