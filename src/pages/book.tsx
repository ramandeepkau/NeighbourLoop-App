import { useRouter } from 'next/router';
import React, { useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function BookPage() {
  const router = useRouter();
  const { service, area } = router.query;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    emailjs.init('UtncHxjSXKdN1xxWJ'); // Replace with your actual Public Key
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await emailjs.sendForm(
        'service_9f0f2pq',          // Your EmailJS Service ID
        'template_bdzgbmf',        // Your EmailJS Template ID
        formRef.current!,          // The form reference
        'UtncHxjSXKdN1xxWJ'        // Your EmailJS Public Key
      );

      console.log('✅ Email sent:', result.text);

      const formData = new FormData(formRef.current!);
      const booking = Object.fromEntries(formData.entries());

      const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([...existing, booking]));

      router.push('/success');
    } catch (error) {
      console.error('❌ EmailJS Error:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Book {service} in {area}
        </h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="service" value={service as string} />
          <input type="hidden" name="area" value={area as string} />
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Your Phone"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="address"
            type="text"
            placeholder="Your Address"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="preferredDate"
            type="date"
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
