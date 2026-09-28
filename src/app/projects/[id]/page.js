import { getDb } from '@/lib/db';
import SidebarLayout from '@/components/SidebarLayout';
import ProjectDetailsClient from './ProjectDetailsClient';

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const db = await getDb();
  
  const project = await db.collection('projects').findOne({ id });
  const bridgesData = await db.collection('bridges').find({ project_id: id }).toArray();
  const documentsData = await db.collection('documents').find({ project_id: id }).toArray();
  
  if (!project) {
    return (
      <SidebarLayout>
        <div className="p-8 text-center text-[var(--text-muted)]">Project not found.</div>
      </SidebarLayout>
    );
  }

  const bridges = bridgesData.map(b => ({ ...b, _id: b._id.toString() }));
  const documents = documentsData.map(d => ({ ...d, _id: d._id.toString() }));

  // Parse coordinates back to array
  const coordinates = project.coordinates ? JSON.parse(project.coordinates) : [];
  const projectData = { ...project, _id: project._id.toString(), coordinates };

  return (
    <SidebarLayout>
      <ProjectDetailsClient project={projectData} bridges={bridges} documents={documents} />
    </SidebarLayout>
  );
}
