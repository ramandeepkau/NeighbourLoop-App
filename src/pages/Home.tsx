import React, { useState } from 'react';

const timetableData = {
  "Dunedin": [
    { number: 1, route: "Palmerston - City", detail: "City - Palmerston" },
    { number: 10, route: "Opoho - City - Shiel Hill", detail: "City - Opoho - Shiel Hill" },
    { number: 11, route: "Shiel Hill - City - Opoho", detail: "City - Shiel Hill - Opoho" },
    { number: 14, route: "Port Chalmers - City", detail: "City - Port Chalmers" },
    { number: 15, route: "Ridge Runner Northbound", detail: "Ridge Runner Southbound" },
    { number: 18, route: "Portobello (Harington Point) - City", detail: "City - Portobello (Harington Point)" },
    { number: 19, route: "Waverley - City - Belleknowes", detail: "City - Belleknowes - Waverley" },
    { number: 23, route: "Corstorphine - Caversham - City - Wakari", detail: "Wakari - City - Caversham - Corstorphine" },
    { number: 37, route: "Concord - City - University", detail: "University - City - Concord" },
    { number: 38, route: "University - City - Concord", detail: "Concord - City - University" },
    { number: 44, route: "St Kilda - City - Halfway Bush", detail: "Halfway Bush - City - St Kilda" },
    { number: 50, route: "St Clair Park - City - Helensburgh", detail: "Helensburgh - City - St Clair Park" },
    { number: 55, route: "St Kilda - City - Brockville", detail: "Brockville - City - St Kilda" },
    { number: 61, route: "City - Kenmure", detail: "Kenmure - City" },
    { number: 63, route: "Balaclava - City - Logan Park", detail: "Logan Park - City - Balaclava" },
    { number: 70, route: "Brighton - Abbotsford and Green Island", detail: "Green Island - Abbotsford and Brighton" },
    { number: 77, route: "Mosgiel, Fairfield, Green Island - City", detail: "City - Green Island, Fairfield, Mosgiel" },
    { number: 78, route: "Mosgiel to City Express", detail: "City to Mosgiel Express" },
    { number: 80, route: "Mosgiel East circuit", detail: "Mosgiel East circuit" },
    { number: 81, route: "Mosgiel West circuit", detail: "Mosgiel West circuit" },
  ],
  "Queenstown": [
    { number: 37, route: "Concord - City - University", detail: "University - City - Concord" },
    // Add Queenstown routes similarly if required
  ]
};

const Home: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setSelectedRoute(null);
  };

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Bus Timetable</h1>
      
      {!selectedArea && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select an Area</h2>
          {Object.keys(timetableData).map((area) => (
            <button
              key={area}
              className="m-2 p-4 bg-blue-500 text-white rounded"
              onClick={() => handleAreaSelect(area)}
            >
              {area}
            </button>
          ))}
        </div>
      )}
      
      {selectedArea && !selectedRoute && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a Route</h2>
          {timetableData[selectedArea].map((route) => (
            <button
              key={route.number}
              className="m-2 p-4 bg-green-500 text-white rounded"
              onClick={() => handleRouteSelect(route)}
            >
              {route.route}
            </button>
          ))}
        </div>
      )}
      
      {selectedRoute && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Timetable</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap">{selectedRoute.route}</td>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap">{selectedRoute.detail}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
