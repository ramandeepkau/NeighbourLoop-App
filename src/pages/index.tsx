import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFjYm1yMjIiLCJhIjoiY2x5ZHRtZDJqMDVsNDJrb3VmZWZoMG9yciJ9.Vid6j50Ey1xMLT6n6g6AgQ';


type Day = {
  day: string;
};

type Trip = {
  service_version: number;
  start_time: string;
  days: Day[];
};

type Stop = {
  stop_id: number;
  order: number;
  increment: number;
  address: string;
  lat: number;
  long: number;
};

type ServiceVersion = {
  version: number;
  stops: Stop[];
};

type Service = {
  code: string;
  direction: string;
  trips: Trip[];
  service_versions: ServiceVersion[];
};

type Route = {
  route_id: number;
  title: string;
  is_school_run: boolean;
  locations: string;
  services: Service[];
};



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

  const getCurrentDayTrips = (service: Service): Trip[] => {
    const today = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    return service.trips.filter((trip: Trip) =>
      trip.days.some((day: Day) => day.day === today)
    );
  };

  const getStopsForCurrentServiceVersion = (service: Service, serviceVersion: number): Stop[] => {
    const versionData = service.service_versions.find((version) => version.version === serviceVersion);
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

  const calculateStopTime = (startTime: string, increment: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const stopTime = new Date();
    stopTime.setHours(hours);
    stopTime.setMinutes(minutes + increment);
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
      <div className={`p-6 rounded-lg  max-w-4xl w-full ${currentPage === 4 ? '' : 'bg-white bg-opacity-90'}`}>
        {currentPage !== 4 && (
          
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Bus Timetable</h1>
          )}
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
                      style={{ backgroundColor: 'dodgerblue', color: 'black' }}
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
                      style={{ backgroundColor: 'dodgerblue', color: 'black' }}
                    >
                      {route.title}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No routes available for this region.</p>
              )}
              <button
                className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                onClick={goBack}
                style={{ backgroundColor: 'lightgrey', color: 'black' }}
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
                     
                     <p className="text-1xl font-bold mb-6" style={{ color: 'darkblue' }}>{service.direction}</p>
                    </div>
                  ))
                ) : (
                  <p>No services available for this route.</p>
                )}
              </div>
              <button
                className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                onClick={goBack}
                style={{ backgroundColor: 'lightgrey', color: 'black' }}
              >
                Back to Routes
              </button>
            </div>
          )}

           {/* Stops display container moved upwards */}
           {currentPage === 4 && selectedService && (
  <div className="w-full md:w-1/2 lg:w-1/3 h-3/4 bg-white p-6 rounded-lg shadow-lg absolute top-20 left-5 sm:left-10">
    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
      Stops for {selectedService.code}
    </h2>

    <div className="flex justify-between items-center mb-4">
      <button
        className="px-2 md:px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
        onClick={handlePrevColumn}
        disabled={visibleColumn === 0}
      >
        &lt;
      </button>
      <button
        className="px-2 md:px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
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
  {getStopsForCurrentServiceVersion(selectedService, 1).map((stop: any, stopIndex: number) => (
    <tr key={stopIndex}>
      <td className="px-6 py-4 text-sm text-gray-700">{stop.address}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {calculateStopTime(getCurrentDayTrips(selectedService)[0]?.start_time, stop.increment)}
      </td>
    </tr>
  ))}
</tbody>


</table>


    <button
      className="mm-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
      onClick={goBack}
      style={{ backgroundColor: 'lightgrey', color: 'black' }}
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

