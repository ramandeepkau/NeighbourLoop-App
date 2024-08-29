import React from 'react';
import { ChevronLeft } from 'lucide-react';

const MapTimetable: React.FC = () => {
    const timetable = [
      { time: '08:00 AM', event: '' },
      { time: '09:30 AM', event: '' },
      { time: '11:00 AM', event: '' },
      { time: '12:30 PM', event: '' },
      { time: '02:00 PM', event: '' },
      { time: '04:00 PM', event: '' },
      { time: '06:00 PM', event: '' },
    ];
  
    return (
      <div className="bg-white bg-opacity-80 text-black p-4 rounded-3xl shadow-lg ">
        <div className="flex items-center  py-2 px-4">

          <h1 className="text-lg font-bold text-gray-800">Route Timetable</h1>
        </div>
        <p className="text-gray-600 font-medium pb-6 text-sm px-4">Here is your schedule for the day:</p>
        
        <div className="mt-4">
          {timetable.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white border border-gray-100 text-gray-600 font-semibold text-sm rounded-md mb-2"
            >
              <span>{item.time}</span>
              <span className="text-right">{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MapTimetable;
  