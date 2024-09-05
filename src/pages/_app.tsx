// /src/pages/_app.tsx
import '../app/globals.css';
import type { AppProps } from 'next/app';
import mapboxgl from 'mapbox-gl';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
