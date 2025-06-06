import React, { useState } from 'react';
import { ChevronDown, Filter, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const regions = ["All Regions", "Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin", "Queenstown", "Invercargill"];

// Define column visibility type
type ColumnKey =
  | 'route'
  | 'busNumber'
  | 'departureTime'
  | 'arrivalTime'
  | 'daysOfOperation'
  | 'startAddress'
  | 'stopAddress'
  | 'status'
  | 'region';

type ColumnVisibilityState = {
  [key in ColumnKey]: boolean;
};

const Home: React.FC = () => {
  const data = [
    { region: "Auckland", route: "A to B", busNumber: 101, departureTime: "06:00 AM", arrivalTime: "07:00 AM", daysOfOperation: "Mon-Fri", startAddress: "Start St, A Town", stopAddress: "Stop St, B Town", status: "on time" },
    { region: "Wellington", route: "A to C", busNumber: 102, departureTime: "07:30 AM", arrivalTime: "08:45 AM", daysOfOperation: "Mon-Sun", startAddress: "Start St, A Town", stopAddress: "Stop St, C Town", status: "delayed" },
    { region: "Christchurch", route: "B to D", busNumber: 103, departureTime: "09:00 AM", arrivalTime: "10:30 AM", daysOfOperation: "Sat-Sun", startAddress: "Start St, B Town", stopAddress: "Stop St, D Town", status: "cancelled" },
    { region: "Hamilton", route: "C to E", busNumber: 104, departureTime: "10:15 AM", arrivalTime: "11:45 AM", daysOfOperation: "Mon-Fri", startAddress: "Start St, C Town", stopAddress: "Stop St, E Town", status: "on time" },
    { region: "Dunedin", route: "D to F", busNumber: 105, departureTime: "12:00 PM", arrivalTime: "01:30 PM", daysOfOperation: "Mon-Sun", startAddress: "Start St, D Town", stopAddress: "Stop St, F Town", status: "delayed" },
    { region: "Auckland", route: "E to G", busNumber: 106, departureTime: "02:00 PM", arrivalTime: "03:30 PM", daysOfOperation: "Mon-Fri", startAddress: "Start St, E Town", stopAddress: "Stop St, G Town", status: "on time" },
    { region: "Wellington", route: "F to H", busNumber: 107, departureTime: "04:00 PM", arrivalTime: "05:30 PM", daysOfOperation: "Sat-Sun", startAddress: "Start St, F Town", stopAddress: "Stop St, H Town", status: "cancelled" },
    { region: "Christchurch", route: "G to I", busNumber: 108, departureTime: "06:00 PM", arrivalTime: "07:30 PM", daysOfOperation: "Mon-Sun", startAddress: "Start St, G Town", stopAddress: "Stop St, I Town", status: "on time" },
    { region: "Hamilton", route: "H to J", busNumber: 109, departureTime: "08:00 PM", arrivalTime: "09:30 PM", daysOfOperation: "Mon-Fri", startAddress: "Start St, H Town", stopAddress: "Stop St, J Town", status: "delayed" },
    { region: "Dunedin", route: "I to K", busNumber: 110, departureTime: "10:00 PM", arrivalTime: "11:30 PM", daysOfOperation: "Sat-Sun", startAddress: "Start St, I Town", stopAddress: "Stop St, K Town", status: "on time" },
    { region: "Queenstown", route: "J to L", busNumber: 111, departureTime: "11:00 AM", arrivalTime: "12:30 PM", daysOfOperation: "Mon-Fri", startAddress: "Start St, J Town", stopAddress: "Stop St, L Town", status: "on time" },
    { region: "Invercargill", route: "K to M", busNumber: 112, departureTime: "01:00 PM", arrivalTime: "02:30 PM", daysOfOperation: "Mon-Sun", startAddress: "Start St, K Town", stopAddress: "Stop St, M Town", status: "delayed" },
  ];

  const [filter, setFilter] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({
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

  const filteredData = data.filter(item =>
    (selectedRegion === 'All Regions' || item.region === selectedRegion) &&
    item.route.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleColumnVisibility = (column: ColumnKey) => {
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
    // ... your JSX stays the same
    // You can paste your original JSX content below this line
    // Since the type fix is the only change needed
  );
};

export default Home;
