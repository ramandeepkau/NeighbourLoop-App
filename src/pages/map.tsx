import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapComponent from '../components/MapComponent';
import MapTimetable from '../components/MapTimetable';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFjYm1yMjIiLCJhIjoiY2x5ZHRtZDJqMDVsNDJrb3VmZWZoMG9yciJ9.Vid6j50Ey1xMLT6n6g6AgQ'; // WILL PUT THIS IN ENV LATER - THIS IS STILL DEV STAGE

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [170.5046, -45.8788], // Stuart Street, Dunedin, NZ [lng, lat]
        zoom: 15, // starting zoom to show the street well
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
    <div className="relative h-screen w-screen">
      <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-4 left-4 z-10 py-4 px-4">
        <MapComponent />
        <MapTimetable />
      </div>
    </div>
  );
};

export default Map;

