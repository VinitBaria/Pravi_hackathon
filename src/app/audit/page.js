import SidebarLayout from '@/components/SidebarLayout';

export default function AuditPage() {
  const auditLogs = [
    { id: 1, ts: '2026-09-28 10:15 AM', actor: 'Admin User', action: 'Project Created', details: 'NH-48 Bypass initialized.' },
    { id: 2, ts: '2026-09-28 11:30 AM', actor: 'DPR Consultant', action: 'Document Uploaded', details: 'Draft DPR v1.pdf uploaded.' },
    { id: 3, ts: '2026-09-28 01:45 PM', actor: 'Admin User', action: 'Document Approved', details: 'Draft DPR v1.pdf marked as approved.' },
  ];

  return (
    <SidebarLayout>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">System Audit Trail</h2>
          <p className="text-[var(--text-muted)] text-sm">Immutable log of all system actions and approvals.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-body)] text-[var(--text-primary)] rounded-lg font-medium transition-colors">
          Export CSV
        </button>
      </header>

      <div className="card rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-body)] border-b border-[var(--border)]">
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Timestamp</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Actor</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Action</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-body)] text-sm">
                <td className="p-4 font-mono text-[var(--text-secondary)]">{log.ts}</td>
                <td className="p-4 font-medium text-[var(--text-primary)]">{log.actor}</td>
                <td className="p-4 text-[var(--text-secondary)] font-semibold">{log.action}</td>
                <td className="p-4 text-[var(--text-secondary)]">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
