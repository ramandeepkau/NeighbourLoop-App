import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Home: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedStartPoint, setSelectedStartPoint] = useState<string | null>(null);

  const regions = ["Dunedin", "Queenstown"];
  const dunedinRoutes = ["Route 1", "Route 2", "Route 3"];
  const queenstownRoutes = ["Route A", "Route B", "Route C"];
  const dunedinStops = {
    "Route 1": ["Stop A1", "Stop A2", "Stop A3"],
    "Route 2": ["Stop B1", "Stop B2", "Stop B3"],
    "Route 3": ["Stop C1", "Stop C2", "Stop C3"],
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSelectedRoute(null);
    setSelectedStartPoint(null);
  };

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
    setSelectedStartPoint(null);
  };

  const handleStartPointSelect = (startPoint: string) => {
    setSelectedStartPoint(startPoint);
  };

  const handleBack = () => {
    if (selectedStartPoint) {
      setSelectedStartPoint(null);
    } else if (selectedRoute) {
      setSelectedRoute(null);
    } else if (selectedRegion) {
      setSelectedRegion(null);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-white p-6">
      <h1 className="text-5xl font-bold text-blue-700 mb-12 text-center">
        Bus Timetable
      </h1>
      {!selectedRegion && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Select a Region</h2>
          <div className="flex justify-around">
            {regions.map((region) => (
              <button
                key={region}
                className="m-2 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-300 ease-in-out"
                onClick={() => handleRegionSelect(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectedRegion && !selectedRoute && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
          <button 
            className="flex items-center mb-4 text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Select a Route</h2>
          <div className="flex justify-around">
            {selectedRegion === "Dunedin"
              ? dunedinRoutes.map((route) => (
                  <button
                    key={route}
                    className="m-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 ease-in-out"
                    onClick={() => handleRouteSelect(route)}
                  >
                    {route}
                  </button>
                ))
              : queenstownRoutes.map((route) => (
                  <button
                    key={route}
                    className="m-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 ease-in-out"
                    onClick={() => handleRouteSelect(route)}
                  >
                    {route}
                  </button>
                ))}
          </div>
        </div>
      )}
      {selectedRoute && !selectedStartPoint && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
          <button 
            className="flex items-center mb-4 text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Select a Starting Point</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dunedinStops[selectedRoute as keyof typeof dunedinStops]?.map(
              (startPoint) => (
                <button
                  key={startPoint}
                  className="m-2 p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300 ease-in-out"
                  onClick={() => handleStartPointSelect(startPoint)}
                >
                  {startPoint}
                </button>
              )
            )}
          </div>
        </div>
      )}
      {selectedStartPoint && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
          <button 
            className="flex items-center mb-4 text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Timetable</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Stop Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  End Point
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dunedinStops[selectedRoute as keyof typeof dunedinStops]?.map(
                (stop, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stop}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {`0${index + 6}:00 AM`} {/* Example start time */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedStartPoint}
                    </td>
                  </tr>
                )
              )}
              ))
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
