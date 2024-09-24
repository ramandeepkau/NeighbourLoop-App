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

  const [stopPage, setStopPage] = useState<number>(0); // For stop pagination

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

   // Define the goBack function here to handle page navigation
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

  // Sample stop data
  const sampleStops = [
    { stop_name: "Middleton Rd, 292", increment: 0 },
    { stop_name: "Middleton Rd, 240", increment: 1 },
    { stop_name: "Corstorphine Rd, 136", increment: 3 },
    { stop_name: "Corstorphine Rd, 12", increment: 4 },
    { stop_name: "Playfair St, 66", increment: 6 },
    // Add more stops as needed
  ];

  const stopsPerPage = 3; // Number of stops to show per page

  const handleNextPage = () => {
    if ((stopPage + 1) * stopsPerPage < sampleStops.length) {
      setStopPage(stopPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (stopPage > 0) {
      setStopPage(stopPage - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center">
        Bus Timetable
      </h1>

      {/* Loading state */}
      {loading ? (
        <p>Loading regions...</p>
      ) : (
        currentPage === 1 && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Choose Your Region</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Dynamically render regions */}
              {!loading && regions?.length > 0 ? (
              regions.map((region: any) => (
              <button
              key={region.id}
             className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
             onClick={() => handleAreaSelect(region.id)}
            style={{ backgroundColor: '#FFFACD', color: 'black' }}
                >
            {region.region_name}  {/* Correct region name */}
            </button>
            ))
            ) : (
          <p>No regions available.</p>
          )}
            </div>
          </div>
        )
      )}

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


      {/* Service selection */}
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
            onClick={() => setCurrentPage(2)}
          >
            Back to Routes
          </button>
        </div>
      )}

      {/* Stops display */}
      {currentPage === 4 && selectedService && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">Stops for {selectedService.code}</h2>

          {getCurrentDayTrips(selectedService).map((trip: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-700">Trip Start Time: {trip.start_time}</h3>
              </div>

              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stop Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleStops.slice(stopPage * stopsPerPage, (stopPage + 1) * stopsPerPage).map((stop: any, stopIndex: number) => {
                    const tripStartTime = new Date(`1970-01-01T${trip.start_time}:00`);
                    const stopTime = new Date(tripStartTime.getTime() + stop.increment * 60000);
                    const formattedStopTime = stopTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <tr key={stopIndex}>
                        <td className="px-6 py-4 text-sm text-gray-700">{stop.stop_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formattedStopTime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
                  onClick={handlePrevPage}
                  disabled={stopPage === 0}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
                  onClick={handleNextPage}
                  disabled={(stopPage + 1) * stopsPerPage >= sampleStops.length}
                >
                  Next
                </button>
              </div>
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
