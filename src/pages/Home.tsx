import React, { useState } from 'react';

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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Bus Timetable
      </h1>
      {!selectedRegion && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Regions</h2>
          {regions.map((region) => (
            <button
              key={region}
              className="m-2 p-4 bg-blue-500 text-white rounded"
              onClick={() => handleRegionSelect(region)}
            >
              {region}
            </button>
          ))}
        </div>
      )}
      {selectedRegion && !selectedRoute && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a Route</h2>
          {selectedRegion === "Dunedin"
            ? dunedinRoutes.map((route) => (
                <button
                  key={route}
                  className="m-2 p-4 bg-green-500 text-white rounded"
                  onClick={() => handleRouteSelect(route)}
                >
                  {route}
                </button>
              ))
            : queenstownRoutes.map((route) => (
                <button
                  key={route}
                  className="m-2 p-4 bg-green-500 text-white rounded"
                  onClick={() => handleRouteSelect(route)}
                >
                  {route}
                </button>
              ))}
        </div>
      )}
      {selectedRoute && !selectedStartPoint && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a Starting Point</h2>
          {dunedinStops[selectedRoute as keyof typeof dunedinStops]?.map(
            (startPoint) => (
              <button
                key={startPoint}
                className="m-2 p-4 bg-yellow-500 text-white rounded"
                onClick={() => handleStartPointSelect(startPoint)}
              >
                {startPoint}
              </button>
            )
          )}
        </div>
      )}
      {selectedStartPoint && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Timetable</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stop Name
                </th>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Point
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dunedinStops[selectedRoute as keyof typeof dunedinStops]?.map(
                (stop, index) => (
                  <tr key={index}>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                      {stop}
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                      {`0${index + 6}:00 AM`} {/* Example start time */}
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                      {selectedStartPoint}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
