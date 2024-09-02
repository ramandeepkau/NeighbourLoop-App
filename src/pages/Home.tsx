import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timetableData, setTimetableData] = useState<any>({});

  const fetchTimetableData = async (region: string) => {
    try {
      const response = await fetch(`https://bus-app-api-kl95.onrender.com/timetable_data_app/${region}`);
      const data = await response.json();
      console.log("API Data:", data);
      setTimetableData({ [region]: data.routes });
    } catch (error) {
      console.error("Error fetching timetable data:", error);
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setSelectedRoute(null);
    setCurrentPage(2);
    fetchTimetableData(area);
  };

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route);
    setCurrentPage(3);
  };

  const handleServiceSelect = (service: any) => {
    console.log('Service selected:', service);
  };

  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center">
        Bus Timetable
      </h1>

      {currentPage === 1 && (
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Choose Your Region</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              onClick={() => handleAreaSelect("DUN")}
              style={{ backgroundColor: '#FFFACD', color: 'black' }}
            >
              Dunedin
            </button>
            <button
              className="m-2 p-4 font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              onClick={() => handleAreaSelect("QUEENSTOWN")}
              style={{ backgroundColor: '#FFFACD', color: 'black' }}
            >
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
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">Services for Route {selectedRoute.title}</h2>
          <div className="grid grid-cols-1 gap-6">
            {selectedRoute.services && selectedRoute.services.length > 0 ? (
              selectedRoute.services.map((service: any) => (
                <div
                  key={service.code}
                  className="p-6 bg-blue-100 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">Service {service.code}</h3>
                  <p className="text-lg text-gray-700">{service.direction}</p>
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
    </div>
  );
};

export default Home;
