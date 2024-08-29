import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapComponent from '../components/MapComponent';
import MapTimetable from '../components/MapTimetable';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFjYm1yMjIiLCJhIjoiY2x5ZHRtZDJqMDVsNDJrb3VmZWZoMG9yciJ9.Vid6j50Ey1xMLT6n6g6AgQ'; // Use the token from environment variables

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [lng, setLng] = useState(170.5046); // Default longitude for Dunedin
  const [lat, setLat] = useState(-45.8788); // Default latitude for Dunedin
  const [zoom, setZoom] = useState(15); // Default zoom level
  const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: userLocation ? [userLocation.lng, userLocation.lat] : [lng, lat],
        zoom: zoom,
      });

      if (userLocation) {
        new mapboxgl.Marker()
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map);
      }

      map.on('load', () => {
        console.log('Map loaded');
      });

      map.on('zoomend', () => {
        console.log('Zoom level:', map.getZoom());
        setZoom(map.getZoom());
      });

      return () => map.remove();
    }
  }, [userLocation]);

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
