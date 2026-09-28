'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.06)';

export default function DashboardCharts({ projects }) {
  // Aggregate data for Status Donut
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCounts).map(s => s.toUpperCase()),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#22c55e', '#3b82f6', '#f97316', '#eab308', '#a855f7', '#64748b'],
      borderWidth: 2,
      borderColor: '#1a2236',
    }]
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    cutout: '65%'
  };

  // Aggregate data for Financial Bar Chart
  const topProjects = [...projects].sort((a, b) => b.estimated_cost - a.estimated_cost).slice(0, 5);
  
  const financeData = {
    labels: topProjects.map(p => p.id),
    datasets: [
      {
        label: 'Sanctioned (Rs. L)',
        data: topProjects.map(p => p.estimated_cost),
        backgroundColor: 'rgba(59,130,246,0.5)',
        borderColor: '#3b82f6',
        borderWidth: 1
      },
      {
        label: 'Spent (Rs. L)',
        data: topProjects.map(p => p.estimated_cost * (p.progress / 100)),
        backgroundColor: 'rgba(234,179,8,0.5)',
        borderColor: '#eab308',
        borderWidth: 1
      }
    ]
  };

  const financeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.04)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="card rounded-xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Project Status Overview</h3>
        <div className="h-64 relative">
          <Doughnut data={statusData} options={statusOptions} />
        </div>
      </div>
      
      <div className="card rounded-xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Top 5 Projects: Financial Utilization</h3>
        <div className="h-64 relative">
          <Bar data={financeData} options={financeOptions} />
        </div>
      </div>
    </div>
  );
}
