'use client';

import SidebarLayout from '@/components/SidebarLayout';
import { createProject } from '@/app/actions';
import { useState, useEffect } from 'react';

export default function CreateProject() {
  const [assetCategory, setAssetCategory] = useState('Road');
  const [assetId, setAssetId] = useState('');

  useEffect(() => {
    setAssetId(`AST-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create New Project</h2>
          <p className="text-[var(--text-muted)] text-sm">Fill out the details to initialize a new asset project in the system.</p>
        </header>

        <div className="card rounded-xl p-6 shadow-sm border border-[var(--border)]">
          <form action={createProject} className="space-y-6">
            <input type="hidden" name="asset_id" value={assetId} />
            
            <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Organizational Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Asset ID (Auto Generated)</label>
                <input type="text" value={assetId} readOnly className="w-full input-field bg-[var(--bg-body)] opacity-70 cursor-not-allowed font-mono text-xs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Government / State</label>
                <select name="govt" required className="w-full input-field bg-white">
                  <option value="">Select State / Govt</option>
                  <option value="Govt of Gujarat">Govt of Gujarat</option>
                  <option value="Govt of Maharashtra">Govt of Maharashtra</option>
                  <option value="Govt of Karnataka">Govt of Karnataka</option>
                  <option value="Govt of Tamil Nadu">Govt of Tamil Nadu</option>
                  <option value="Govt of Uttar Pradesh">Govt of Uttar Pradesh</option>
                  <option value="Central Government (MoRTH)">Central Government (MoRTH)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Department</label>
                <select name="department" required className="w-full input-field bg-white">
                  <option value="">Select Department</option>
                  <option value="Roads & Buildings (R&B)">Roads & Buildings (R&B)</option>
                  <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                  <option value="National Highways Authority (NHAI)">National Highways Authority (NHAI)</option>
                  <option value="Municipal Corporation">Municipal Corporation</option>
                  <option value="Panchayat Raj">Panchayat Raj</option>
                  <option value="Urban Development Authority">Urban Development Authority</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Asset Category</label>
                <select name="asset_category" value={assetCategory} onChange={e => setAssetCategory(e.target.value)} className="w-full input-field font-semibold text-blue-600 bg-blue-500/5">
                  <option value="Road">Road</option>
                  <option value="Building">Building</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4 mt-8">Project Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Name</label>
                <input type="text" name="name" required className="w-full input-field" placeholder="e.g. NH-48 Bypass" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type / Subtype</label>
                <select name="type" className="w-full input-field">
                  {assetCategory === 'Road' ? (
                    <>
                      <option>New Road</option>
                      <option>Widening</option>
                      <option>Maintenance</option>
                      <option>Bridge</option>
                    </>
                  ) : (
                    <>
                      <option>New Construction</option>
                      <option>Renovation</option>
                      <option>Extension</option>
                    </>
                  )}
                </select>
              </div>
              
              {assetCategory === 'Road' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start Point</label>
                    <input type="text" name="start_point" className="w-full input-field" placeholder="Location name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">End Point</label>
                    <input type="text" name="end_point" className="w-full input-field" placeholder="Location name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Length (km)</label>
                    <input type="number" name="length" step="0.1" required className="w-full input-field" placeholder="0.0" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location / Address</label>
                    <input type="text" name="location" className="w-full input-field" placeholder="City / Address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total Area (sq ft)</label>
                    <input type="number" name="area" step="1" required className="w-full input-field" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Number of Floors</label>
                    <input type="number" name="floors" step="1" required className="w-full input-field" placeholder="1" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Estimated Cost (Rs. L)</label>
                <input type="number" name="cost" step="0.1" required className="w-full input-field text-green-600 font-bold bg-green-500/5" placeholder="0.0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description / Scope</label>
              <textarea name="description" required className="w-full input-field" rows="4" placeholder="Detailed project scope..."></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button type="button" className="px-4 py-2 bg-[var(--bg-body)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-md">
                Initialize Project Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}
