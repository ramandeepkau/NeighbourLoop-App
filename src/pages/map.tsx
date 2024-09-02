import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapComponent from '../components/MapComponent';
import MapTimetable from '../components/MapTimetable';

mapboxgl.accessToken = 'your_mapbox_access_token';

interface Route {
  title: string;
  id: string;
  locations: string;
  services: Array<{ code: string; direction: string }>;
}

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [lng, setLng] = useState(170.5046); // Default longitude for Dunedin
  const [lat, setLat] = useState(-45.8788); // Default latitude for Dunedin
  const [zoom, setZoom] = useState(15); // Default zoom level
  const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]); // State to store the routes
  const [selectedServices, setSelectedServices] = useState<Array<{ code: string; direction: string }> | null>(null); // State to store the selected route's services

  useEffect(() => {
    const fetchTimetableData = async () => {
      const region = 'DUN'; // Region "DUN"
      try {
        console.log(`Fetching timetable data for region: ${region}`);
        const response = await fetch(`https://bus-app-api-kl95.onrender.com/timetable_data_app/${region}`);
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log("API Data:", data);

        if (data && data.routes) {
          setRoutes(data.routes);
        } else {
          console.warn("No routes found in the response data");
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetableData(); // Fetch data for the specified region
  }, []);

  const handleSelectRegion = async (regionTitle: string, services: Array<{ code: string; direction: string }>) => {
    setSelectedServices(services);
    try {
      const response = await fetch(`https://bus-app-api-kl95.onrender.com/regions/${regionTitle}`);
      const regionData = await response.json();
      console.log(`Data for region title ${regionTitle}:`, regionData);
    } catch (error) {
      console.error(`Error fetching data for region title ${regionTitle}:`, error);
    }
  };

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
        <MapComponent routes={routes} onSelectRegion={handleSelectRegion} />
        <MapTimetable services={selectedServices} />
      </div>
    </div>
  );
};

export default Map;
