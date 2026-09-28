'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function MapWrapper({ projects, bridges }) {
  return <MapComponent projects={projects} bridges={bridges} />;
}
