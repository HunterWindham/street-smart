'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { getMapboxToken } from '@/lib/mapbox';

const SearchBox = dynamic(
  () =>
    import('@mapbox/search-js-react').then((mod) => ({ default: mod.SearchBox })),
  { ssr: false }
);

const DEFAULT_ZOOM = 12;

const AddressSearchBox = () => {
  const router = useRouter();

  return (
    <SearchBox
      accessToken={getMapboxToken()}
      placeholder='Search for any address or city...'
      options={{
        language: 'en',
        country: 'US',
      }}
      onRetrieve={(res) => {
        const feature = res.features[0];
        if (!feature?.geometry?.coordinates) return;

        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties ?? {};
        const placeName = props.name;
        const city = props.context?.place?.name ?? '';
        const state = props.context?.region?.name ?? '';
        const zip = props.context?.postcode?.name ?? '';

        const params = new URLSearchParams({
          lng: String(lng),
          lat: String(lat),
          zoom: String(DEFAULT_ZOOM),
        });
        if (placeName) params.set('place_name', placeName);
        if (city) params.set('city', city);
        if (state) params.set('state', state);
        if (zip) params.set('zip', zip);

        router.push(`/insights?${params.toString()}`);
      }}
    />
  );
};

export default AddressSearchBox;
