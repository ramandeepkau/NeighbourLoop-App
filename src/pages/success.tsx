import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SuccessPage() {
  const [latestBooking, setLatestBooking] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const last = storedBookings[storedBookings.length - 1];
    setLatestBooking(last);
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-100 to-green-200 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for choosing NeighbourLoop.</p>

        {latestBooking ? (
          <div className="text-left text-sm bg-gray-50 p-4 rounded mb-4 shadow-inner">
            <p><strong>Service:</strong> {latestBooking.service}</p>
            <p><strong>Area:</strong> {latestBooking.area}</p>
            <p><strong>Name:</strong> {latestBooking.name}</p>
            <p><strong>Phone:</strong> {latestBooking.phone}</p>
            <p><strong>Address:</strong> {latestBooking.address}</p>
            <p><strong>Preferred Date:</strong> {latestBooking.preferredDate}</p>
            <p><strong>Booking Time:</strong> {new Date(latestBooking.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading your booking...</p>
        )}

        <button
          onClick={handleBack}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
