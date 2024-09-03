// /pages/map.tsx
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function MapPage() {
  return (
    <div>
      <map />
    </div>
  );
}
