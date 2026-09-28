import SidebarLayout from '@/components/SidebarLayout';

export default function ProcurementPage() {
  const tenders = [
    { id: 'TND-2026-01', title: 'Ward 7 Paver Block Construction', status: 'open', deadline: '2026-10-15' },
    { id: 'TND-2026-02', title: 'NH-48 Flyover Concrete Works', status: 'awarded', deadline: '2026-08-01' },
  ];

  return (
    <SidebarLayout>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Procurement & Tenders</h2>
          <p className="text-[var(--text-muted)] text-sm">Manage open bids and awarded contracts.</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">
          + Publish Tender
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tenders.map(t => (
          <div key={t.id} className="card rounded-xl p-6 border-t-4" style={{ borderTopColor: t.status === 'open' ? 'var(--color-primary)' : 'var(--color-success)' }}>
            <div className="text-xs font-mono text-[var(--text-muted)] mb-1">{t.id}</div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t.title}</h4>
            
            <div className="flex justify-between text-sm mb-4">
              <span className="text-[var(--text-secondary)]">Deadline:</span>
              <span className="font-medium text-[var(--text-primary)]">{t.deadline}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className={`px-2 py-1 text-xs font-medium rounded uppercase ${t.status === 'open' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                {t.status}
              </span>
              <button className="text-sm text-blue-500 hover:underline">View Bids</button>
            </div>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
}
