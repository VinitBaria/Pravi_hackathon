import SidebarLayout from '@/components/SidebarLayout';

export default function SurveyPage() {
  return (
    <SidebarLayout>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Field Survey Data</h2>
          <p className="text-[var(--text-muted)] text-sm">Chainage reports, soil tests, and topographical data.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          + Add Survey Data
        </button>
      </header>

      <div className="card rounded-xl p-6 text-center text-[var(--text-muted)]">
        Select a project from the left or add new survey data to populate the chainage records here.
      </div>
    </SidebarLayout>
  );
}
