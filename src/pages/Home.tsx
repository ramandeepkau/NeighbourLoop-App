import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [timetableData, setTimetableData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [regions, setRegions] = useState<any[]>([]);
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

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setSelectedRoute(null);
    setCurrentPage(2);
    fetchTimetableData(area);
  };

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

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route);
    setCurrentPage(3);
  };

  const getCurrentDayTrips = (service: any) => {
    const today = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    return service.trips.filter((trip: any) =>
      trip.days.some((day: any) => day.day === today)
    );
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
    const tripStartTime = new Date(`1970-01-01T${startTime}:00`);
    const stopTime = new Date(tripStartTime.getTime() + increment * 60000);
    return stopTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center">
        Bus Timetable
      </h1>

      {loading ? (
        <p>Loading regions...</p>
      ) : (
        currentPage === 1 && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Choose Your Region</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {regions.map((region: any) => (
                <button
                  key={region.id}
                  className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  onClick={() => handleAreaSelect(region.id)}
                  style={{ backgroundColor: '#FFFACD', color: 'black' }}
                >
                  {region.region_name}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {currentPage === 2 && selectedArea && (
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Select a Route</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {timetableData[selectedArea]?.map((route: any) => (
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
          <button
            className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600"
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
            {selectedRoute.services.map((service: any) => (
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
            ))}
          </div>
          <button
            className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg"
            onClick={() => setCurrentPage(2)}
          >
            Back to Routes
          </button>
        </div>
      )}

      {currentPage === 4 && selectedService && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">Stops for {selectedService.code}</h2>

          {getCurrentDayTrips(selectedService).map((trip: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                {/* <h3 className="text-lg font-bold text-gray-700">Trip Start Time: {trip.start_time}</h3> */}
              </div>

              {/* Arrows for navigating time columns */}
              <div className="flex justify-between mb-4">
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

              {/* Display the stops and calculated times */}
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stop Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedService.service_versions[0]?.stops.map((stop: any, stopIndex: number) => (
                    <tr key={stop.stop_id}>
                      <td className="px-6 py-4 text-sm text-gray-700">{stop.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {calculateStopTime(trip.start_time, stop.increment + visibleColumn * 30)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <button
            className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg"
            onClick={() => setCurrentPage(3)}
          >
            Back to Services
          </button>
          </div>
      )}
    </div>
  );
};

export default Home;
