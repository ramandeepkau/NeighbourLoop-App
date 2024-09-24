import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFjYm1yMjIiLCJhIjoiY2x5ZHRtZDJqMDVsNDJrb3VmZWZoMG9yciJ9.Vid6j50Ey1xMLT6n6g6AgQ';

const CombinedPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [timetableData, setTimetableData] = useState<any>({});
  const [regions, setRegions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleColumn, setVisibleColumn] = useState<number>(0);

  const router = useRouter();

  // Fetch regions from API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('https://bus-app-api-kl95.onrender.com/region_data_app');
        const data = await response.json();
        setRegions(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching regions:', error);
        setLoading(false);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [172.6362, -41.5000],
        zoom: 5,
      });

      map.on('load', () => {
        setMapLoaded(true);
        mapInstance.current = map;
      });

      return () => map.remove();
    }
  }, []);

  const fetchTimetableData = async (region: string) => {
    try {
      const response = await fetch(`https://bus-app-api-kl95.onrender.com/timetable_data_app/${region}`);
      const data = await response.json();
      setTimetableData({ [region]: data.routes });
    } catch (error) {
      console.error('Error fetching timetable data:', error);
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setSelectedRoute(null);
    setSelectedService(null);
    setCurrentPage(2);
    fetchTimetableData(area);

    if (mapInstance.current && regions.find(r => r.id === area)) {
      const regionData = regions.find(r => r.id === area);
      const { lng, lat, zoom } = regionData;
      mapInstance.current.flyTo({
        center: [lng || 170.5046, lat || -45.8788],
        zoom: zoom || 12,
        essential: true,
      });
    }
  };

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route);
    setCurrentPage(3);
  };

  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentDayTrips = (service: any) => {
    const today = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    return service.trips.filter((trip: any) =>
      trip.days.some((day: any) => day.day === today)
    );
  };

  const getStopsForCurrentServiceVersion = (service: any, serviceVersion: number) => {
    const versionData = service.service_versions.find((version: any) => version.version === serviceVersion);
    return versionData ? versionData.stops : [];
  };

  const handleNextColumn = () => {
    setVisibleColumn((prevColumn) => prevColumn + 1);
  };

  const handlePrevColumn = () => {
    if (visibleColumn > 0) {
      setVisibleColumn((prevColumn) => prevColumn - 1);
    }
  };

  const calculateStopTime = (startTime: string, increment: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const tripStartTime = new Date();
    tripStartTime.setHours(hours);
    tripStartTime.setMinutes(minutes);
  
    const stopTime = new Date(tripStartTime.getTime() + increment * 60000);
    return stopTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  return (
    <div className="relative h-screen w-screen">
      {/* Map background */}
      <div
        ref={mapContainer}
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Bus Timetable</h1>

          {loading ? (
            <p>Loading regions...</p>
          ) : currentPage === 1 ? (
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Choose Your Region</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {regions.length > 0 ? (
                  regions.map((region: any) => (
                    <button
                      key={region.id}
                      className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                      onClick={() => handleAreaSelect(region.id)}
                      style={{ backgroundColor: '#FFFACD', color: 'black' }}
                    >
                      {region.region_name}
                    </button>
                  ))
                ) : (
                  <p>No regions available.</p>
                )}
              </div>
            </div>
          ) : null}

          {currentPage === 2 && selectedArea && (
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Select a Route</h2>
              {timetableData[selectedArea] && timetableData[selectedArea].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {timetableData[selectedArea].map((route: any) => (
                    <button
                      key={route.title}
                      className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                      onClick={() => handleRouteSelect(route)}
                      style={{ backgroundColor: '#FFFACD', color: 'black' }}
                    >
                      {route.title}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No routes available for this region.</p>
              )}
              <button
                className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105"
                onClick={goBack}
              >
                Back to Regions
              </button>
            </div>
          )}

          {currentPage === 3 && selectedRoute && (
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Services for Route {selectedRoute.title}</h2>
              <div className="grid grid-cols-1 gap-6">
                {selectedRoute.services && selectedRoute.services.length > 0 ? (
                  selectedRoute.services.map((service: any) => (
                    <div
                      key={service.code}
                      className="p-4 bg-blue-100 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => {
                        setSelectedService(service);
                        setCurrentPage(4);
                      }}
                    >
                      <h3 className="text-lg font-bold text-blue-700 mb-1">Service {service.code}</h3>
                      <p className="text-sm text-gray-700">{service.direction}</p>
                    </div>
                  ))
                ) : (
                  <p>No services available for this route.</p>
              )}
              </div>
              <button
                className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105"
                onClick={goBack}
              >
                Back to Routes
              </button>
            </div>
          )}

          {/* Stops display */}
          {currentPage === 4 && selectedService && (
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-8">
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Stops for {selectedService.code}
              </h2>
              
              <div className="flex justify-between items-center mb-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
                  onClick={handlePrevColumn}
                  disabled={visibleColumn === 0}
                >
                  &lt;
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
                  onClick={handleNextColumn}
                >
                  &gt;
                </button>
              </div>

              {/* Stops Table */}
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stop Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentDayTrips(selectedService).map((trip: any, index: number) => (
                    <React.Fragment key={index}>
                      {getStopsForCurrentServiceVersion(selectedService, trip.service_version).map((stop: any, stopIndex: number) => (
                        <tr key={stopIndex}>
                          <td className="px-6 py-4 text-sm text-gray-700">{stop.address}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {calculateStopTime(trip.start_time, stop.increment)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <button
                className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg"
                onClick={goBack}
              >
                Back to Services
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator for the map */}
      {!mapLoaded && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20 bg-white bg-opacity-80">
          <div className="text-2xl text-gray-700">Loading Map...</div>
        </div>
      )}
    </div>
  );
};

export default CombinedPage;