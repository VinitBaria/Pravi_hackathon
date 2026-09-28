export const dynamic = 'force-dynamic';

import SidebarLayout from '@/components/SidebarLayout';
import { getDb } from '@/lib/db';
import MapWrapper from './MapWrapper';

export default async function GISPage() {
  const db = await getDb();
  const projectsData = await db.collection('projects').find({}).toArray();
  const bridgesData = await db.collection('bridges').find({}).toArray();

  const projects = projectsData.map(p => ({ ...p, _id: p._id.toString() }));
  const bridges = bridgesData.map(b => ({ ...b, _id: b._id.toString() }));

  return (
    <SidebarLayout>
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">GIS Interactive Map</h2>
        <p className="text-[var(--text-muted)] text-sm">Real-time geographical tracking of roads and assets.</p>
      </header>
      
      <div className="card rounded-xl overflow-hidden h-[calc(100vh-140px)] border border-[var(--border)] relative z-0">
        <MapWrapper projects={projects} bridges={bridges} />
      </div>
    </SidebarLayout>
  );
}
