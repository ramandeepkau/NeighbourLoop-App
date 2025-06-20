import React from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      router.push(`/services?area=${encodeURIComponent(selected)}`);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-gray-900">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 shadow-md bg-white">
        <div className="text-2xl font-bold text-blue-600">NeighbourLoop</div>
        <div className="space-x-4">
          <button className="text-sm font-medium hover:underline">Help</button>
          <button className="text-sm font-medium hover:underline">Register</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700">Login</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-1">
        {/* Left Side with Image */}
        <div className="hidden md:flex w-1/2">
          <img
            src="/plumber.jpg"
            alt="Plumber"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side with Black Background */}
        <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-3xl font-semibold mb-6 text-center">Where do you need a service?</h1>
          <select
            className="w-full max-w-sm p-3 rounded text-black"
            onChange={handleCitySelect}
          >
            <option value="">Select your city</option>
            <option value="Terrace">Terrace</option>
            <option value="Kitimat">Kitimat</option>
            <option value="Prince George">Prince George</option>
            <option value="Prince Rupart">Prince Rupart</option>
          </select>
        </div>
      </div>
    </div>
  );
}
