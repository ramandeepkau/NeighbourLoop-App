import React from 'react';
import { useRouter } from 'next/router';

const servicesData: Record<string, string[]> = {
  terrace: ['Cleaning', 'Plumbing', 'Salon', 'Home Repair'],
  kitimat: ['Plumbing', 'Home Repair'],
  'prince george': ['Cleaning', 'Salon'],
  'prince rupart': ['Salon', 'Home Repair'],
};

const serviceImages: Record<string, string> = {
  Cleaning: '/cleaning.jpg',
  Plumbing: '/plumbing.jpg',
  Salon: '/salon.jpg',
  'Home Repair': '/repair.jpg',
};

export default function ServicesPage() {
  const router = useRouter();
  const { area } = router.query;

  const services =
    typeof area === 'string' ? servicesData[area.toLowerCase()] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Services Available in{' '}
        {typeof area === 'string'
          ? area.charAt(0).toUpperCase() + area.slice(1)
          : '...'}
      </h1>

      {services.length === 0 ? (
        <p className="text-center text-gray-600">
          No services available for this area.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service: string) => (
            <div
              key={service}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={serviceImages[service]}
                alt={service}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center font-semibold text-lg text-gray-800">
                {service}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
