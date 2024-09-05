
// /pages/map.tsx
import dynamic from 'next/dynamic';



import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapComponent from '../components/MapComponent';
import MapTimetable from '../components/MapTimetable';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFjYm1yMjIiLCJhIjoiY2x5ZHRtZDJqMDVsNDJrb3VmZWZoMG9yciJ9.Vid6j50Ey1xMLT6n6g6AgQ';

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

      // Three points in Dunedin
      const point1 = [170.5046, -45.8788]; // Dunedin City Center
      const point2 = [170.52005249180758, -45.86720564233047]; // Dunedin Botanic Garden (updated)
      const point3 = [170.51984093837848, -45.8660208108327]; // Across from Polytechnic D Block

      // Custom SVG markers
      const createCustomMarker = (svg: string) => {
        const el = document.createElement('div');
        el.innerHTML = svg;
        el.style.width = '24px';
        el.style.height = '24px';
        return el;
      };

      const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
      const busSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>`;
      const footprintsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>`;

      // Add markers for the three points
      new mapboxgl.Marker(createCustomMarker(mapPinSvg))
        .setLngLat(point1)
        .addTo(map);

      new mapboxgl.Marker(createCustomMarker(busSvg))
        .setLngLat(point2)
        .addTo(map);

      new mapboxgl.Marker(createCustomMarker(footprintsSvg))
        .setLngLat(point3)
        .addTo(map);

      // Draw routes between the points
      map.on('load', () => {
        getRoute(map, point1, point2, 'route1', false);
        getRoute(map, point3, point2, 'route2', true);
      });

      map.on('zoomend', () => {
        console.log('Zoom level:', map.getZoom());
        setZoom(map.getZoom());
      });

      return () => map.remove();
    }
  }, [userLocation]);

  // Updated getRoute function to handle dotted lines
  const getRoute = async (map: mapboxgl.Map, start: [number, number], end: [number, number], routeId: string, isDotted: boolean) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;

    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (map.getSource(routeId)) {
      (map.getSource(routeId) as mapboxgl.GeoJSONSource).setData(geojson as any);
    } else {
      map.addLayer({
        id: routeId,
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000000', // Changed to black
          'line-width': 5,
          'line-opacity': 0.75,
          'line-dasharray': isDotted ? [2, 2] : [1],
        }
      });
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-4 left-4 z-10 py-4 px-4">
        <MapComponent routes={routes} onSelectRegion={handleSelectRegion} />
        {selectedServices && selectedServices.length > 0 && (
          <MapTimetable services={selectedServices} />
        )}
      </div>
    </div>
  );
};

export default Map;

