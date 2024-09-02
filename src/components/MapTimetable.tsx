import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface Service {
  code: string;
  direction: string;
}

interface MapTimetableProps {
  services: Service[] | null; // Prop for services
}

const MapTimetable: React.FC<MapTimetableProps> = ({ services }) => {
  return (
    <div className="bg-white bg-opacity-80 text-black p-4 rounded-3xl shadow-lg">
      <div className="flex items-center py-2 px-4">
        <h1 className="text-lg font-bold text-gray-800">Stops</h1>
      </div>
      <p className="text-gray-600 font-medium pb-6 text-sm px-4">Here are the stops for your route</p>

      <div className="mt-4">
        {services ? (
          services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white border border-gray-100 text-gray-600 font-semibold text-sm rounded-md mb-2"
            >
              <span>{service.code}</span>
              <span className="text-right">{service.direction}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No services available</div>
        )}
      </div>
    </div>
  );
};

export default MapTimetable;
