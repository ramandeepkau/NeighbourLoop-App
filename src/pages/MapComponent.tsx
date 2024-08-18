import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
  useEffect(() => {
    // Ensure that the map is only created once
    const map = L.map('map').setView([-45.8788, 170.5028], 13); // Coordinates for Dunedin, New Zealand

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      map.remove(); // Cleanup map on component unmount
    };
  }, []);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
