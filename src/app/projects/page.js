export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import ProjectsListClient from './ProjectsListClient';

export default async function ProjectsPage() {
  const db = await getDb();
  const projectsData = await db.collection('projects').find({}).toArray();
  const projects = projectsData.map(p => ({ ...p, _id: p._id.toString() }));
  
  return <ProjectsListClient initialProjects={projects} />;
}
