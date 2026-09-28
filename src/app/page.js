'use client';

import { useAuth } from './providers';
import { ROLES } from '@/lib/data';
import { Moon, Sun, Road } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const { role, login } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // If already logged in, redirect
  useEffect(() => {
    if (role) {
      if (role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/projects');
      }
    }
  }, [role, router]);

  const handleLogin = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const selectedRole = fd.get('role');
    const name = fd.get('username') || selectedRole;
    login(selectedRole, name);
  };

  if (!mounted) return null; // Avoid hydration mismatch for themes

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-body)]">
      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-sidebar)] transition-colors"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="card p-8 rounded-2xl w-full max-w-md shadow-xl border border-[var(--border)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/30">
            <Road size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">RoadWorks GIS</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Project Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Select Role</label>
            <select name="role" className="w-full input-field" required>
              {Object.entries(ROLES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your Name</label>
            <input type="text" name="username" className="w-full input-field" placeholder="John Doe" />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
