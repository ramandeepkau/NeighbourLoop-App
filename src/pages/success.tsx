import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SuccessPage() {
  const [booking, setBooking] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBooking(data[data.length - 1]);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Booking Confirmed!</h1>
        <p className="text-gray-700 mb-4">Thank you for choosing NeighbourLoop.</p>
        {booking ? (
          <div className="text-left bg-gray-50 p-4 rounded shadow-inner text-sm mb-4">
            <p><strong>Service:</strong> {booking.service}</p>
            <p><strong>Area:</strong> {booking.area}</p>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Preferred Date:</strong> {booking.preferredDate}</p>
            <p><strong>Booking Time:</strong> {new Date(booking.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading booking details...</p>
        )}
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
