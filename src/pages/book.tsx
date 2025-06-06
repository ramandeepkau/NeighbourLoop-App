import { useRouter } from 'next/router';
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function BookPage() {
  const router = useRouter();
  const { service, area } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const booking = {
      service,
      area,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));

    // ✅ Send confirmation email using EmailJS
    emailjs
      .send(
        'service_ozyyxid', // ✅ Your EmailJS Service ID
        'template_m4rjzj9', // ✅ Your EmailJS Template ID
        {
          name: formData.name,
          service,
          area,
          date: formData.date,
          time: formData.time,
        },
        'KQjsLNF2KZjtbIDzB' // ✅ Your EmailJS Public Key
      )
      .then(() => {
        router.push('/success');
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        router.push('/success'); // Still go to success screen
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Book {service} in {area}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
