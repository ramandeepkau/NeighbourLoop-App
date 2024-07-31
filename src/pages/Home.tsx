import React, { useState } from 'react';

const Home: React.FC = () => {
  const data = [
    { route: "A to B", busNumber: 101, departureTime: "06:00 AM", arrivalTime: "07:00 AM", daysOfOperation: "Mon-Fri" },
    { route: "A to C", busNumber: 102, departureTime: "07:30 AM", arrivalTime: "08:45 AM", daysOfOperation: "Mon-Sun" },
    { route: "B to D", busNumber: 103, departureTime: "09:00 AM", arrivalTime: "10:30 AM", daysOfOperation: "Sat-Sun" },
    { route: "C to E", busNumber: 104, departureTime: "10:15 AM", arrivalTime: "11:45 AM", daysOfOperation: "Mon-Fri" },
    { route: "D to F", busNumber: 105, departureTime: "12:00 PM", arrivalTime: "01:30 PM", daysOfOperation: "Mon-Sun" },
    { route: "E to G", busNumber: 106, departureTime: "02:00 PM", arrivalTime: "03:30 PM", daysOfOperation: "Mon-Fri" },
    { route: "F to H", busNumber: 107, departureTime: "04:00 PM", arrivalTime: "05:30 PM", daysOfOperation: "Sat-Sun" },
    { route: "G to I", busNumber: 108, departureTime: "06:00 PM", arrivalTime: "07:30 PM", daysOfOperation: "Mon-Sun" },
    { route: "H to J", busNumber: 109, departureTime: "08:00 PM", arrivalTime: "09:30 PM", daysOfOperation: "Mon-Fri" },
    { route: "I to K", busNumber: 110, departureTime: "10:00 PM", arrivalTime: "11:30 PM", daysOfOperation: "Sat-Sun" },
  ];

  const [filter, setFilter] = useState('');

  const filteredData = data.filter(item =>
    item.route.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Bus Timetable v2
      </h1>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Filter routes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-md mr-4 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days of Operation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length ? (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{row.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.busNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.departureTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.arrivalTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.daysOfOperation}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
