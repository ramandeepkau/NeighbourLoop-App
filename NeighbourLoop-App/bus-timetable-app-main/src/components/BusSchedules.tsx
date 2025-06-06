import React, { useState, useEffect } from 'react';
import { getBusSchedules } from '../apiService'; // Adjust the import path as necessary
import { BusSchedule } from '../types'; // Adjust the import path as necessary

const BusSchedules: React.FC = () => {
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusSchedules = async () => {
      try {
        const data = await getBusSchedules();
        setBusSchedules(data);
      } catch (err) {
        setError('Failed to fetch bus schedules.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusSchedules();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Bus Schedules</h1>
      <ul>
        {busSchedules.map((schedule) => (
          <li key={schedule.id}>
            {schedule.routeTitle} - {schedule.departureTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusSchedules;
