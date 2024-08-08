import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getRegions } from '../apiService'; // Correct import path

interface BusData {
  region: string;
  route: string;
  busNumber: number;
  departureTime: string;
  arrivalTime: string;
  daysOfOperation: string;
  startAddress: string;
  stopAddress: string;
  status: string;
}

interface RegionData {
  id: string;
  region_name: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<BusData[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [columnVisibility, setColumnVisibility] = useState({
    route: true,
    busNumber: true,
    departureTime: true,
    arrivalTime: true,
    daysOfOperation: true,
    startAddress: true,
    stopAddress: true,
    status: true,
    region: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...');
        const fetchedRegions = await getRegions();
        console.log('Fetched regions:', fetchedRegions);

        if (Array.isArray(fetchedRegions)) {
          setRegions(fetchedRegions);
        } else {
          console.error('Fetched data is not an array:', fetchedRegions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const dummyData: BusData[] = [
    { region: "Dunedin", route: "A to B", busNumber: 101, departureTime: "06:00 AM", arrivalTime: "07:00 AM", daysOfOperation: "Mon-Fri", startAddress: "Start St, A Town", stopAddress: "Stop St, B Town", status: "on time" },
    { region: "Dunedin", route: "C to D", busNumber: 102, departureTime: "08:00 AM", arrivalTime: "09:00 AM", daysOfOperation: "Sat-Sun", startAddress: "Start St, C Town", stopAddress: "Stop St, D Town", status: "delayed" },
    { region: "Queenstown", route: "E to F", busNumber: 103, departureTime: "10:00 AM", arrivalTime: "11:00 AM", daysOfOperation: "Mon-Fri", startAddress: "Start St, E Town", stopAddress: "Stop St, F Town", status: "cancelled" },
    { region: "Queenstown", route: "G to H", busNumber: 104, departureTime: "12:00 PM", arrivalTime: "01:00 PM", daysOfOperation: "Mon-Sun", startAddress: "Start St, G Town", stopAddress: "Stop St, H Town", status: "on time" },
  ];

  const filteredData = dummyData.filter(item => 
    (selectedRegion === 'All Regions' || item.region === selectedRegion) &&
    item.route.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleColumnVisibility = (column: keyof typeof columnVisibility) => {
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
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Bus Timetable v2
      </h1>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap items-center mb-4">
          <input
            type="text"
            placeholder="Filter routes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-full mr-4 p-2 border border-gray-300 rounded mb-2 md:mb-0"
          />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="max-w-full mr-4 p-2 border border-gray-300 rounded mb-2 md:mb-0"
          >
            <option value="All Regions">All Regions</option>
            {regions.map((region) => (
              <option key={region.id} value={region.region_name}>{region.region_name}</option>
            ))}
          </select>
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
                  checked={columnVisibility[column as keyof typeof columnVisibility]}
                  onCheckedChange={() => toggleColumnVisibility(column as keyof typeof columnVisibility)}
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
                {columnVisibility.route && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>}
                {columnVisibility.busNumber && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>}
                {columnVisibility.departureTime && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>}
                {columnVisibility.arrivalTime && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>}
                {columnVisibility.daysOfOperation && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days of Operation</th>}
                {columnVisibility.startAddress && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Address</th>}
                {columnVisibility.stopAddress && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Address</th>}
                {columnVisibility.status && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                {columnVisibility.region && <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedData.length ? (
                displayedData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {columnVisibility.route && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.route}</td>}
                    {columnVisibility.busNumber && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.busNumber}</td>}
                    {columnVisibility.departureTime && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.departureTime}</td>}
                    {columnVisibility.arrivalTime && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.arrivalTime}</td>}
                    {columnVisibility.daysOfOperation && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.daysOfOperation}</td>}
                    {columnVisibility.startAddress && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.startAddress}</td>}
                    {columnVisibility.stopAddress && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.stopAddress}</td>}
                    {columnVisibility.status && (
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap flex items-center">
                        {getStatusIcon(row.status)}
                        <span className="ml-2">{row.status}</span>
                      </td>
                    )}
                    {columnVisibility.region && <td className="px-2 md:px-6 py-4 whitespace-nowrap">{row.region}</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(columnVisibility).length} className="px-2 md:px-6 py-4 text-center">No results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            {filteredData.length} of {dummyData.length} row(s) selected.
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-700">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="max-w-full p-2 border border-gray-300 rounded"
            >
              {[5, 10, 15, 20].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
