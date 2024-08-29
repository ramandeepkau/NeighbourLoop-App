import React, { useState, useEffect } from 'react';
import { ChevronLeft, Navigation, MapPin, ChevronDown } from 'lucide-react';

interface Route {
  title: string;
  locations: string;
  // Add other properties if needed
}

interface MapComponentProps {
  currentLocation?: string;
  routes: Route[];
}

const MapComponent: React.FC<MapComponentProps> = ({ currentLocation, routes }) => {
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [streetName, setStreetName] = useState<string>('Stuart Street, Dunedin, NZ');
  const [selectedLocation, setSelectedLocation] = useState<string>('Current Location');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    if (currentLocation) {
      setStreetName(currentLocation);
    } else {
      setStreetName('Dunedin'); // Default location
    }
  }, [currentLocation]);

  const toggleDropdown1 = () => {
    setShowDropdown1(!showDropdown1);
    setShowDropdown2(false); // Close the other dropdown
  };

  const toggleDropdown2 = () => {
    setShowDropdown2(!showDropdown2);
    setShowDropdown1(false); // Close the other dropdown
  };

  const selectLocation = (location: string) => {
    setSelectedLocation(location);
    setShowDropdown1(false);
  };

  const selectRoute = (route: string) => {
    setSelectedRoute(route);
    setShowDropdown2(false);
  };

  return (
    <div className="bg-white bg-opacity-80 text-black p-4 rounded-3xl shadow-lg mb-4">
      <div className="flex items-center py-2 px-2">
        <ChevronLeft className="mr-2 text-gray-800 cursor-pointer" />
        <h1 className="text-lg font-bold text-gray-800">{streetName}</h1>
      </div>
      <p className="text-gray-600 font-medium pb-6 text-sm px-10">Welcome to the map!</p>

      <div className="mt-4">
        {/* First Dropdown: Select Location */}
        <div
          className="flex items-center justify-between p-2 bg-white shadow-inner text-gray-600 font-semibold text-sm rounded-md cursor-pointer mb-2"
          onClick={toggleDropdown1}
        >
          <div className="flex items-center">
            <Navigation className="mr-2 h-4 w-4" />
            <span>{selectedLocation}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </div>
        {showDropdown1 && (
          <div className="bg-white shadow-inner text-gray-600 font-semibold text-sm rounded-md mt-1">
            <div
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => selectLocation('Current Location')}
            >
              Current Location
            </div>
            <div
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => selectLocation('Stuart Street, Dunedin, NZ')}
            >
              Stuart Street, Dunedin, NZ
            </div>
          </div>
        )}

        {/* Second Dropdown: Select Route */}
        <div
          className="flex items-center justify-between p-2 bg-white shadow-inner text-gray-600 font-semibold text-sm rounded-md cursor-pointer"
          onClick={toggleDropdown2}
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{selectedRoute ? selectedRoute : "Where you want to go"}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </div>
        {showDropdown2 && (
          <div className="bg-white shadow-inner text-gray-600 font-semibold text-sm rounded-md mt-1">
            {routes.length > 0 ? (
              routes.map((route) => (
                <div
                  key={route.title}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => selectRoute(route.locations)}
                >
                  {route.locations}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No routes available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
