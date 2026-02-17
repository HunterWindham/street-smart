'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '@/lib/mapbox';

const DEFAULT_CENTER: [number, number] = [-98.5, 39.8];
const DEFAULT_ZOOM = 3;

const Map = () => {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const lng = searchParams.get('lng');
  const lat = searchParams.get('lat');
  const zoomParam = searchParams.get('zoom');

  const center = useMemo<[number, number]>(
    () =>
      lng != null && lat != null && !Number.isNaN(Number(lng)) && !Number.isNaN(Number(lat))
        ? [Number(lng), Number(lat)]
        : DEFAULT_CENTER,
    [lng, lat]
  );
  const zoom = useMemo(
    () =>
      zoomParam != null && !Number.isNaN(Number(zoomParam))
        ? Number(zoomParam)
        : DEFAULT_ZOOM,
    [zoomParam]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = getMapboxToken();

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: DEFAULT_ZOOM,
    });

    const marker = new mapboxgl.Marker().setLngLat(center).addTo(map);
    markerRef.current = marker;

    mapRef.current = map;
    return () => {
      marker.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    map.flyTo({ center, zoom, speed: .75 });
    marker.setLngLat(center);
  }, [center, zoom]);

  return (
    <div
      ref={containerRef}
      className="h-[400px] w-full rounded-lg border border-gray-200"
      aria-label="Map"
    />
  );
};

export default Map;
