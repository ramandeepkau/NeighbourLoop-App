import React, { useState, useEffect } from 'react';
import { getStops } from '../apiService'; // Adjust the import path as necessary
import { Stop } from '../types'; // Adjust the import path as necessary

const Stops: React.FC = () => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const data = await getStops();
        setStops(data);
      } catch (err) {
        setError('Failed to fetch stops.');
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Stops</h1>
      <ul>
        {stops.map((stop) => (
          <li key={stop.id}>
            {stop.address_name} ({stop.lat}, {stop.long})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stops;
