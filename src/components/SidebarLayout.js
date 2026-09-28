'use client';

import { useAuth } from '@/app/providers';
import { ROLES } from '@/lib/data';
import { Road, Activity, Map, Bridge, LogOut, Sun, Moon, FileText, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SidebarLayout({ children }) {
  const { role, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!role) {
      router.push('/');
    }
  }, [role, router]);

  if (!mounted || !role) return null;

  const roleData = ROLES[role];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-body)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Road className="text-blue-500" />
            RoadWorks
          </h1>
          <p className="text-xs text-slate-400 mt-1">{roleData?.label}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {role === 'admin' && (
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Activity size={18} /> Admin Dashboard
            </Link>
          )}

          <Link 
            href="/projects" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname.startsWith('/projects') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Road size={18} /> Projects
          </Link>
          
          {role !== 'engineer' && (
            <>
              <Link 
                href="/gis" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/gis' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Map size={18} /> GIS Map
              </Link>

              <Link 
                href="/bridges" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/bridges' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Bridge size={18} /> Bridges
              </Link>
            </>
          )}

          {(role === 'admin' || role === 'finance' || role === 'fin_sanction' || role === 'accounts' || role === 'auditor') && (
            <Link 
              href="/finance" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/finance' ? 'bg-yellow-500/20 text-yellow-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <FileText size={18} /> Finance & Budget
            </Link>
          )}

          {(role === 'admin' || role === 'qc' || role === 'contractor') && (
            <Link 
              href="/qc" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/qc' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Activity size={18} /> Quality Control
            </Link>
          )}

          {(role === 'admin' || role === 'surveyor' || role === 'dpr') && (
            <Link 
              href="/survey" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/survey' ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Map size={18} /> Field Survey
            </Link>
          )}

          {(role === 'admin' || role === 'procurement' || role === 'contractor') && (
            <Link 
              href="/procurement" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/procurement' ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <FileText size={18} /> Procurement
            </Link>
          )}

          {(role === 'admin' || role === 'auditor') && (
            <Link 
              href="/audit" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/audit' ? 'bg-red-500/20 text-red-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <FileText size={18} /> Audit Trail
            </Link>
          )}

          {role === 'admin' && (
            <Link 
              href="/projects/new" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/projects/new' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Plus size={18} /> Create Project
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white truncate">{user}</span>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {children}
      </main>
    </div>
  );
}
