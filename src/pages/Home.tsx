import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [timetableData, setTimetableData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [regions, setRegions] = useState<any[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const router = useRouter();

  // Fetch regions from API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('https://bus-app-api-kl95.onrender.com/region_data_app');
        const data = await response.json();
        console.log("API Data:", data);  // Log the full response
        setRegions(data.data); // Make sure to set 'data'
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
    
    console.log('Fetching timetable for area:', area);
  };
  
  const fetchTimetableData = async (region: string) => {
    try {
      const response = await fetch(`https://bus-app-api-kl95.onrender.com/timetable_data_app/${region}`);
      const data = await response.json();
      console.log('Timetable Data:', data);  // Add this to inspect data
      setTimetableData({ [region]: data.routes });
    } catch (error) {
      console.error("Error fetching timetable data:", error);
    }
  };
  
  // Add this function in your code
const goBack = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleRouteSelect = (route: any) => {
  setSelectedRoute(route);
  setCurrentPage(3); // Go to the next page after selecting a route
};


  // Define sampleStops with proper typing
  const sampleStops = [
    { stop_name: "Middleton Rd, 292", times: ["6:32 PM", "7:02 PM", "7:32 PM"], next_service: "10:32 PM" },
    { stop_name: "Middleton Rd, 240", times: ["6:33 PM", "7:03 PM", "7:33 PM"], next_service: "10:33 PM" },
    { stop_name: "Corstorphine Rd, 136", times: ["6:35 PM", "7:05 PM", "7:35 PM"], next_service: "10:35 PM" }
  ];

  // Check if regions are loaded before rendering
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
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <div className="text-gray-600 mr-2">Date:</div>
        <input
          type="date"
          className="border rounded p-2"
          defaultValue={new Date().toISOString().substr(0, 10)}
        />
      </div>
    </div>
    <table className="min-w-full table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stop Name</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {selectedService.stops && selectedService.stops.length > 0 ? (
          selectedService.stops.map((stop: any, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-700">{stop.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{stop.time}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="px-6 py-4 text-sm text-gray-700" colSpan={2}>No stops available</td>
          </tr>
        )}
      </tbody>
    </table>
    <button
      className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105"
      onClick={goBack}
    >
      Back to Services
    </button>
  </div>
      )}
    </div>
  );
};

export default Home;
