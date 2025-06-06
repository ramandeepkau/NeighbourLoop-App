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
    <div className="min-h-screen bg-white py-10 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center mb-10">
        Services in {typeof area === 'string' ? area : '...'}
      </h1>

      {services.length === 0 ? (
        <p className="text-center text-gray-600">
          No services available for this area.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service: string) => (
            <div
              key={service}
              className="bg-white shadow-md rounded-2xl overflow-hidden transform transition hover:scale-105 hover:shadow-lg flex flex-col justify-between"
            >
              <img
                src={serviceImages[service]}
                alt={service}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800">{service}</h2>
                <p className="text-sm text-gray-500 mt-1">Trusted professionals near you</p>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
                  onClick={() =>
                    router.push(
                      `/book?service=${encodeURIComponent(service)}&area=${encodeURIComponent(
                        area as string
                      )}`
                    )
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
