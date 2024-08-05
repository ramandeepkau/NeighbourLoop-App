import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9, // starting zoom
      });

      map.on('load', () => {
        console.log('Map loaded');
      });

      map.on('zoomend', () => {
        console.log('Zoom level:', map.getZoom());
      });

      return () => map.remove();
    }
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen">
      <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full z-50" />
    </div>
  );
};

export default Map;
