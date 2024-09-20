import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFjYm1yMjIiLCJhIjoiY2x5ZHRtZDJqMDVsNDJrb3VmZWZoMG9yciJ9.Vid6j50Ey1xMLT6n6g6AgQ';

const IndexPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [timetableData, setTimetableData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();

  // Coordinates for Dunedin and Queenstown
  const regions = {
    DUN: { lng: 170.5046, lat: -45.8788, zoom: 12 },
    QUEENSTOWN: { lng: 168.6626, lat: -45.0312, zoom: 12 },
  };

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
      console.error("Error fetching timetable data:", error);
    }
  };


  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setSelectedRoute(null);
    setCurrentPage(2);
    fetchTimetableData(area);

    if (mapInstance.current && regions[area]) {
      const { lng, lat, zoom } = regions[area];
      mapInstance.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        essential: true,
      });
    }
  };

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route);
    setCurrentPage(3);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentPage(4);
  };

  // Helper function to calculate time
  const getStopTime = (startTime: string, increment: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + increment);
    return startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Table for the sketch you provided
  const renderTimetable = (trip: any) => {
    return (
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Service</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Start Time</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Next Time ➔</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Display mock stop names and times based on the API data */}
          {trip.stops && trip.stops.length > 0 ? (
            trip.stops.map((stop: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-700">Stop {index + 1}</td> {/* Mock stop names */}
                <td className="px-6 py-4 text-sm text-gray-700">{trip.start_time}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{getStopTime(trip.start_time, stop.increment)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{getStopTime(trip.start_time, stop.increment + 5)} ➔</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-sm text-gray-700" colSpan="4">No stops available for this service.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Map as background */}
      <div ref={mapContainer} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Bus Timetable</h1>

          {currentPage === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Choose Your Region</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" onClick={() => handleAreaSelect("DUN")} style={{ backgroundColor: '#FFFACD', color: 'black' }}>
                  Dunedin
                </button>
                <button className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" onClick={() => handleAreaSelect("QUEENSTOWN")} style={{ backgroundColor: '#FFFACD', color: 'black' }}>
                  Queenstown
                </button>
              </div>
            </div>
          )}

          {currentPage === 2 && selectedArea && (
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Select a Route</h2>
              {timetableData[selectedArea] && timetableData[selectedArea].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {timetableData[selectedArea].map((route: any) => (
                    <button key={route.title} className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" onClick={() => handleRouteSelect(route)} style={{ backgroundColor: '#FFFACD', color: 'black' }}>
                      <span className="inline-block bg-blue-500 text-white text-lg font-bold px-4 py-2 rounded-full mb-2">
                        {route.title}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p>No routes available for this region.</p>
              )}
              <button className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105" onClick={goBack}>
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
                                onClick={() => handleServiceSelect(service)}
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
                          Back to Regions
                        </button>
                        </div>
                         )}
          
                    {currentPage === 4 && selectedService && (
                      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-8">
                        <h2 className="text-3xl font-semibold mb-6 text-center">
                          Stops for {selectedService.code} - {selectedService.direction}
                        </h2>
          
                        {/* Display the timetable according to the sketch */}
                        {selectedService.trips && selectedService.trips.length > 0 ? (
                          selectedService.trips.map((trip: any, tripIndex: number) => (
                            <div key={tripIndex} className="mb-6">
                              <h3 className="text-xl font-semibold mb-4">
                                Service Version {trip.service_version}
                              </h3>
                              {/* Render timetable based on the sketch */}
                              {renderTimetable(trip)}
                            </div>
                          ))
                        ) : (
                          <p>No services available for this route.</p>
                        )}
          
                        <button
                          className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105"
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
          
          export default IndexPage;
          
