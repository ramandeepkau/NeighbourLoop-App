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
      <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center">
        Dunedin Bus Timetable
      </h1>

      {!selectedArea && (
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Choose Your Region</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(timetableData).map((area) => (
              <button
                key={area}
                className="m-2 p-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-green-600 transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleAreaSelect(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedArea && !selectedRoute && (
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Select a Route</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {timetableData[selectedArea].map((route) => (
              <button
                key={route.number}
                className="m-2 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleRouteSelect(route)}
              >
                {route.route}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedRoute && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">Timetable for {selectedRoute.route}</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-semibold">
                  {selectedRoute.route}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {selectedRoute.detail}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className="mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105"
            onClick={() => setSelectedRoute(null)}
          >
            Back to Routes
          </button>
          <button
            className="mt-6 ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform transition-transform duration-300 hover:scale-105"
            onClick={() => setSelectedArea(null)}
          >
            Back to Areas
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
