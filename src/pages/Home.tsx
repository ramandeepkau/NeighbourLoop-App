import React, { useState } from 'react';
import { ChevronDown, Filter, MoreHorizontal, Clipboard, Eye, EyeOff, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Home: React.FC = () => {
  const data = [
    { route: "A to B", busNumber: 101, departureTime: "06:00 AM", arrivalTime: "07:00 AM", daysOfOperation: "Mon-Fri", startAddress: "Start St, A Town", stopAddress: "Stop St, B Town", status: "on time" },
    { route: "A to C", busNumber: 102, departureTime: "07:30 AM", arrivalTime: "08:45 AM", daysOfOperation: "Mon-Sun", startAddress: "Start St, A Town", stopAddress: "Stop St, C Town", status: "delayed" },
    { route: "B to D", busNumber: 103, departureTime: "09:00 AM", arrivalTime: "10:30 AM", daysOfOperation: "Sat-Sun", startAddress: "Start St, B Town", stopAddress: "Stop St, D Town", status: "cancelled" },
    { route: "C to E", busNumber: 104, departureTime: "10:15 AM", arrivalTime: "11:45 AM", daysOfOperation: "Mon-Fri", startAddress: "Start St, C Town", stopAddress: "Stop St, E Town", status: "on time" },
    { route: "D to F", busNumber: 105, departureTime: "12:00 PM", arrivalTime: "01:30 PM", daysOfOperation: "Mon-Sun", startAddress: "Start St, D Town", stopAddress: "Stop St, F Town", status: "delayed" },
    { route: "E to G", busNumber: 106, departureTime: "02:00 PM", arrivalTime: "03:30 PM", daysOfOperation: "Mon-Fri", startAddress: "Start St, E Town", stopAddress: "Stop St, G Town", status: "on time" },
    { route: "F to H", busNumber: 107, departureTime: "04:00 PM", arrivalTime: "05:30 PM", daysOfOperation: "Sat-Sun", startAddress: "Start St, F Town", stopAddress: "Stop St, H Town", status: "cancelled" },
    { route: "G to I", busNumber: 108, departureTime: "06:00 PM", arrivalTime: "07:30 PM", daysOfOperation: "Mon-Sun", startAddress: "Start St, G Town", stopAddress: "Stop St, I Town", status: "on time" },
    { route: "H to J", busNumber: 109, departureTime: "08:00 PM", arrivalTime: "09:30 PM", daysOfOperation: "Mon-Fri", startAddress: "Start St, H Town", stopAddress: "Stop St, J Town", status: "delayed" },
    { route: "I to K", busNumber: 110, departureTime: "10:00 PM", arrivalTime: "11:30 PM", daysOfOperation: "Sat-Sun", startAddress: "Start St, I Town", stopAddress: "Stop St, K Town", status: "on time" },
  ];

  const [filter, setFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    route: true,
    busNumber: true,
    departureTime: true,
    arrivalTime: true,
    daysOfOperation: true,
    startAddress: true,
    stopAddress: true,
    status: true,
  });

  const filteredData = data.filter(item =>
    item.route.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on time":
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case "delayed":
        return <AlertCircle className="text-yellow-500 h-5 w-5" />;
      case "cancelled":
        return <XCircle className="text-red-500 h-5 w-5" />;
      default:
        return null;
    }
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(columnVisibility).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  className="capitalize"
                  checked={columnVisibility[column]}
                  onCheckedChange={() => toggleColumnVisibility(column)}
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columnVisibility.route && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>}
                {columnVisibility.busNumber && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>}
                {columnVisibility.departureTime && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>}
                {columnVisibility.arrivalTime && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>}
                {columnVisibility.daysOfOperation && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days of Operation</th>}
                {columnVisibility.startAddress && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Address</th>}
                {columnVisibility.stopAddress && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Address</th>}
                {columnVisibility.status && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length ? (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {columnVisibility.route && <td className="px-6 py-4 whitespace-nowrap">{row.route}</td>}
                    {columnVisibility.busNumber && <td className="px-6 py-4 whitespace-nowrap">{row.busNumber}</td>}
                    {columnVisibility.departureTime && <td className="px-6 py-4 whitespace-nowrap">{row.departureTime}</td>}
                    {columnVisibility.arrivalTime && <td className="px-6 py-4 whitespace-nowrap">{row.arrivalTime}</td>}
                    {columnVisibility.daysOfOperation && <td className="px-6 py-4 whitespace-nowrap">{row.daysOfOperation}</td>}
                    {columnVisibility.startAddress && <td className="px-6 py-4 whitespace-nowrap">{row.startAddress}</td>}
                    {columnVisibility.stopAddress && <td className="px-6 py-4 whitespace-nowrap">{row.stopAddress}</td>}
                    {columnVisibility.status && (
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        {getStatusIcon(row.status)}
                        <span className="ml-2">{row.status}</span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(columnVisibility).length} className="px-6 py-4 text-center">No results found.</td>
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
