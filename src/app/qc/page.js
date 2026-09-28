import SidebarLayout from '@/components/SidebarLayout';

export default function QCPage() {
  const tests = [
    { id: 'QC-101', project: 'NH-48 Bypass', type: 'Soil CBR', result: 'pass', date: '2026-09-10', expected: 'Min 5.0%', actual: '5.2%' },
    { id: 'QC-102', project: 'Ward 7 Road', type: 'Core Density', result: 'fail', date: '2026-09-15', expected: '98%', actual: '92%' },
    { id: 'QC-103', project: 'Aji Dam Flyover', type: 'Concrete Cube', result: 'pass', date: '2026-09-18', expected: 'M35', actual: '38.5 MPa' },
  ];

  return (
    <SidebarLayout>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Quality Control Tests</h2>
        <p className="text-[var(--text-muted)] text-sm">Review lab and field test results.</p>
      </header>

      <div className="card rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-body)] border-b border-[var(--border)]">
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Test ID</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Project</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Type</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Expected</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Actual</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Result</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-body)]">
                <td className="p-4 text-sm font-mono text-[var(--text-muted)]">{t.id}</td>
                <td className="p-4 text-sm font-medium text-[var(--text-primary)]">{t.project}</td>
                <td className="p-4 text-sm text-[var(--text-secondary)]">{t.type}</td>
                <td className="p-4 text-sm text-[var(--text-secondary)]">{t.expected}</td>
                <td className="p-4 text-sm font-medium text-[var(--text-primary)]">{t.actual}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded uppercase ${t.result === 'pass' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {t.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
