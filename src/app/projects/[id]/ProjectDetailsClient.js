'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { WORKFLOW_STEPS, ROLES } from '@/lib/data';
import { FileText, Clock, Info, CheckCircle, MessageSquare, UploadCloud, Bridge, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailsClient({ project, bridges, documents = [] }) {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [extraDprDocs, setExtraDprDocs] = useState([]);
  const [extraPlanningDocs, setExtraPlanningDocs] = useState([]);
  const [extraQcDocs, setExtraQcDocs] = useState([]);
  const [qcDecision, setQcDecision] = useState('');
  const [viewDocument, setViewDocument] = useState(null);

  const docsByOffice = documents.reduce((acc, doc) => {
    const roleObj = ROLES[doc.uploadedBy];
    const officeName = roleObj ? roleObj.label : doc.uploadedBy;
    if (!acc[officeName]) acc[officeName] = [];
    acc[officeName].push(doc);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <Link href="/projects" className="text-blue-500 hover:underline text-sm mb-2 inline-block">← Back to Projects</Link>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm font-mono text-[var(--text-muted)]">{project.id}</div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">{project.name}</h2>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-[var(--text-secondary)]">
              <span className={`px-2 py-1 border rounded-md uppercase tracking-wider text-xs ${project.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500 font-bold' : 'bg-[var(--bg-card)] border-[var(--border)]'}`}>{project.status}</span>
              <span className="px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-md">Length: {project.length || 0} {project.asset_category === 'Building' ? 'sq.m' : 'km'}</span>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-700 border border-blue-500/20 font-bold rounded-md">Budget: Rs. {project.estimated_cost || 0} L</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-700 border border-green-500/20 font-bold rounded-md">Paid: Rs. {project.spent_cost || 0} L</span>
              <span className="px-2 py-1 bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 font-bold rounded-md">Remaining: Rs. {Math.max(0, (project.estimated_cost || 0) - (project.spent_cost || 0)).toFixed(2)} L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] mb-6">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Overview</button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'history' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>History & Workflow</button>
        <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'documents' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Documents</button>
        {project.has_bridge === 1 && (
          <button onClick={() => setActiveTab('bridges')} className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'bridges' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Bridges</button>
        )}
      </div>

      {/* Tab Content */}
      <div className="card rounded-xl p-6">
        
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2"><Info size={18} /> Description</h3>
              <p className="text-[var(--text-secondary)]">{project.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-body)] rounded-lg border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)]">Priority</div>
                <div className="font-semibold text-[var(--text-primary)] capitalize">{project.priority || 'Normal'}</div>
              </div>
              <div className="p-4 bg-[var(--bg-body)] rounded-lg border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)]">Type</div>
                <div className="font-semibold text-[var(--text-primary)] capitalize">{project.type}</div>
              </div>
              <div className="p-4 bg-[var(--bg-body)] rounded-lg border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)]">Start Point</div>
                <div className="font-semibold text-[var(--text-primary)] truncate">{project.start_point || '-'}</div>
              </div>
              <div className="p-4 bg-[var(--bg-body)] rounded-lg border border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)]">Current {project.asset_category === 'Building' || project.asset_category === 'Bridge' ? 'Condition Score' : 'RCI'}</div>
                <div className={`font-semibold ${project.rci < 40 ? 'text-red-500' : project.rci < 70 ? 'text-yellow-500' : 'text-green-500'}`}>{project.rci} / 100</div>
              </div>
            </div>
            <div className="mt-6 p-5 bg-[var(--bg-body)] rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Assigned Project Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Project Creator</div>
                  <div className="font-semibold text-sm text-[var(--text-primary)]">Admin (System)</div>
                  <div className="text-xs text-blue-500 mt-1">ID: ADM-001</div>
                </div>
                {project.current_step >= 1 && (
                  <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Engineering Lead</div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">R. Sharma</div>
                    <div className="text-xs text-blue-500 mt-1">ID: ENG-482</div>
                  </div>
                )}
                {project.current_step >= 2 && (
                  <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">GIS Mapping Team</div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">Team Alpha</div>
                    <div className="text-xs text-blue-500 mt-1">ID: GIS-991</div>
                  </div>
                )}
                {project.current_step >= 3 && (
                  <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">DPR Consultant</div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">Design Co.</div>
                    <div className="text-xs text-blue-500 mt-1">ID: DPR-220</div>
                  </div>
                )}
                {project.current_step >= 12 && (
                  <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Quality Control</div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">Central Lab</div>
                    <div className="text-xs text-blue-500 mt-1">ID: QC-773</div>
                  </div>
                )}
                {project.current_step >= 15 && (
                  <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Maintenance</div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">City Works</div>
                    <div className="text-xs text-blue-500 mt-1">ID: MNT-339</div>
                  </div>
                )}
              </div>
            </div>
            
            {project.contractor_id && (
              <div className="mt-6 p-5 bg-blue-500/5 rounded-xl border border-blue-500/20 shadow-sm">
                <h3 className="text-sm font-bold text-blue-600 mb-3 border-b border-blue-500/20 pb-2 flex items-center gap-2">
                  <Info size={16} /> Assigned Contractor Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-blue-600/70 mb-1 font-medium">Contractor ID</div>
                    <div className="font-bold text-[var(--text-primary)] bg-[var(--bg-card)] px-3 py-1.5 rounded border border-[var(--border)]">{project.contractor_id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600/70 mb-1 font-medium">Name / Agency</div>
                    <div className="font-bold text-[var(--text-primary)] bg-[var(--bg-card)] px-3 py-1.5 rounded border border-[var(--border)]">{project.contractor_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600/70 mb-1 font-medium">Mobile No</div>
                    <div className="font-bold text-[var(--text-primary)] bg-[var(--bg-card)] px-3 py-1.5 rounded border border-[var(--border)]">{project.contractor_mobile}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance History - Visible to ALL roles */}
            {project.maintenance_records && project.maintenance_records.length > 0 && (
              <div className="mt-6 p-5 bg-orange-500/5 rounded-xl border border-orange-500/20 shadow-sm">
                <h3 className="text-sm font-bold text-orange-700 mb-4 border-b border-orange-500/20 pb-2 flex items-center gap-2">
                  <Clock size={16} /> Maintenance History ({project.maintenance_records.length} Inspections)
                </h3>
                <div className="space-y-3">
                  {project.maintenance_records.map((rec, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${rec.rci >= 70 ? 'bg-green-500/5 border-green-500/20' : rec.rci >= 40 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-700 text-xs font-bold rounded-full border border-orange-500/30 whitespace-nowrap">{rec.period}</span>
                        <div>
                          <div className="text-sm font-medium text-[var(--text-primary)]">
                            {new Date(rec.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          {rec.notes && <div className="text-xs text-[var(--text-muted)] italic mt-0.5 line-clamp-1">{rec.notes}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {rec.report_name && (
                          <span className="text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-1 rounded flex items-center gap-1">
                            <FileText size={12} /> Report
                          </span>
                        )}
                        {rec.photo_count > 0 && (
                          <span className="text-xs bg-purple-500/10 text-purple-600 border border-purple-500/20 px-2 py-1 rounded">
                            📷 {rec.photo_count}
                          </span>
                        )}
                        <span className={`text-sm font-bold ${rec.rci >= 70 ? 'text-green-600' : rec.rci >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {rec.rci}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const activeStepIndex = project.current_step !== undefined ? project.current_step : 0;
              const activeStep = WORKFLOW_STEPS[activeStepIndex];
              const isAuthorized = activeStep && activeStep.roles.includes(role);
              
              if (project.status === 'rejected') {
                return (
                  <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Project Rejected</h3>
                    <p className="text-sm text-red-700">This project was rejected during the financial sanctioning phase. It cannot proceed further in the workflow.</p>
                  </div>
                );
              }

              if (isAuthorized) {
                return (
                  <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/30 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2"><Info size={18} /> Action Required: {activeStep.label}</h3>
                    
                    {activeStep.key === '3' ? (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm font-medium text-yellow-700 mb-3">
                          GIS mapping is strictly required for this stage. You cannot forward this project until you have plotted the coordinates on the interactive map.
                        </p>
                        <Link href="/gis" className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                          Go to GIS Mapping Tool
                        </Link>
                      </div>
                    ) : activeStep.key === '4' ? (
                      <>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Please upload the required baseline reports (Traffic, Soil) and any additional documentation.</p>
                        <form action={async (formData) => {
                           formData.append('role', role);
                           const { advanceDprStep } = await import('@/app/actions');
                           await advanceDprStep(project.id, activeStepIndex, formData);
                           setShowConfirmation(true);
                           setTimeout(() => setShowConfirmation(false), 5000);
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Traffic Report (Required)</label>
                              <input type="file" name="traffic_report" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                            </div>
                            <div className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Soil Report (Required)</label>
                              <input type="file" name="soil_report" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                            </div>
                          </div>
                          
                          <div className="p-4 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-bold text-[var(--text-primary)]">Additional Documents</label>
                              <button type="button" onClick={() => setExtraDprDocs([...extraDprDocs, { id: Date.now() }])} className="text-xs bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-500/20 font-semibold transition-colors">+ Add Document</button>
                            </div>
                            {extraDprDocs.map((doc, i) => (
                              <div key={doc.id} className="flex gap-3 mb-3 items-end">
                                <div className="flex-1">
                                  <input type="text" name={`extra_name_${i}`} placeholder="Document Name (e.g. Environmental Clearance)" required className="w-full text-sm bg-[var(--bg-card)] border border-[var(--border)] p-2 rounded-md" />
                                </div>
                                <div className="flex-1">
                                  <input type="file" name={`extra_file_${i}`} required className="w-full text-xs text-[var(--text-secondary)] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[var(--border)] file:text-[var(--text-primary)]" />
                                </div>
                                <button type="button" onClick={() => setExtraDprDocs(extraDprDocs.filter(d => d.id !== doc.id))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md">X</button>
                              </div>
                            ))}
                            {extraDprDocs.length === 0 && <div className="text-xs text-[var(--text-muted)] italic">No additional documents added.</div>}
                            <input type="hidden" name="extra_count" value={extraDprDocs.length} />
                          </div>
                          
                          <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-body)] p-3 rounded-lg border border-[var(--border)]">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="font-medium">Final Submission: I verify that the Traffic Report, Soil Report, and all appended documents are correct and ready for administrative prioritization.</span>
                          </label>
                          
                          <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                            <CheckCircle size={18} /> Submit DPR & Forward Project
                          </button>
                        </form>
                      </>
                    ) : activeStep.key === '5' ? (
                      <>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Please upload the required clearance documents (Land, Environmental) and any additional permissions.</p>
                        <form action={async (formData) => {
                           formData.append('role', role);
                           const { advancePlanningStep } = await import('@/app/actions');
                           await advancePlanningStep(project.id, activeStepIndex, formData);
                           setShowConfirmation(true);
                           setTimeout(() => setShowConfirmation(false), 5000);
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Land Document (Required)</label>
                              <input type="file" name="land_document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                            </div>
                            <div className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Environmental Permission (Required)</label>
                              <input type="file" name="env_permission" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                            </div>
                          </div>
                          
                          <div className="p-4 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-bold text-[var(--text-primary)]">Additional Clearances</label>
                              <button type="button" onClick={() => setExtraPlanningDocs([...extraPlanningDocs, { id: Date.now() }])} className="text-xs bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-500/20 font-semibold transition-colors">+ Add Clearance</button>
                            </div>
                            {extraPlanningDocs.map((doc, i) => (
                              <div key={doc.id} className="flex gap-3 mb-3 items-end">
                                <div className="flex-1">
                                  <input type="text" name={`extra_name_${i}`} placeholder="Document Name (e.g. Utility Clearance)" required className="w-full text-sm bg-[var(--bg-card)] border border-[var(--border)] p-2 rounded-md" />
                                </div>
                                <div className="flex-1">
                                  <input type="file" name={`extra_file_${i}`} required className="w-full text-xs text-[var(--text-secondary)] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[var(--border)] file:text-[var(--text-primary)]" />
                                </div>
                                <button type="button" onClick={() => setExtraPlanningDocs(extraPlanningDocs.filter(d => d.id !== doc.id))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md">X</button>
                              </div>
                            ))}
                            {extraPlanningDocs.length === 0 && <div className="text-xs text-[var(--text-muted)] italic">No additional clearances added.</div>}
                            <input type="hidden" name="extra_count" value={extraPlanningDocs.length} />
                          </div>
                          
                          <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-body)] p-3 rounded-lg border border-[var(--border)]">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="font-medium">Final Submission: I verify that the Land Document, Environmental Permission, and all appended clearances are correct and complete.</span>
                          </label>
                          
                          <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                            <CheckCircle size={18} /> Submit Clearances & Forward Project
                          </button>
                        </form>
                      </>
                    ) : activeStep.key === '6' ? (
                      <>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Review all previous documents, assess the asset inventory, and provide the proposed budget for financial sanction.</p>
                        <form action={async (formData) => {
                           formData.append('role', role);
                           const { advanceAssetManagerStep } = await import('@/app/actions');
                           await advanceAssetManagerStep(project.id, activeStepIndex, formData);
                           setShowConfirmation(true);
                           setTimeout(() => setShowConfirmation(false), 5000);
                        }} className="space-y-4">
                          <div className="p-4 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Proposed Budget (Rs. L)</label>
                            <input type="number" name="proposed_budget" step="0.1" required defaultValue={project.estimated_cost} className="w-full input-field text-blue-600 font-bold bg-blue-500/5 text-lg" placeholder="0.0" />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Upload Budget Proposal / Asset Report (Required)</label>
                            <input type="file" name="document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white border border-[var(--border)] rounded bg-[var(--bg-card)] p-1.5" />
                          </div>
                          
                          <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-body)] p-3 rounded-lg border border-[var(--border)]">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="font-medium">I verify that all previously uploaded documents are correct, the asset registry is checked, and I approve this budget proposal.</span>
                          </label>
                          
                          <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                            <CheckCircle size={18} /> Submit Budget Proposal
                          </button>
                        </form>
                      </>
                    ) : activeStep.key === '7' ? (
                      <>
                        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg shadow-sm">
                          <h4 className="font-bold text-yellow-700 mb-1">Asset Manager Proposed Budget</h4>
                          <div className="text-2xl font-black text-yellow-800">Rs. {project.proposed_budget || project.estimated_cost} L</div>
                          <p className="text-xs text-yellow-700 mt-2">Please review the budget proposal and documents. You may sanction the full amount, approve with a cut-down, or reject the project entirely.</p>
                        </div>
                        <form action={async (formData) => {
                           formData.append('role', role);
                           const { advanceFinanceStep } = await import('@/app/actions');
                           await advanceFinanceStep(project.id, activeStepIndex, formData);
                           setShowConfirmation(true);
                           setTimeout(() => setShowConfirmation(false), 5000);
                        }} className="space-y-4">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Financial Decision</label>
                              <select name="decision" required className="w-full input-field font-semibold">
                                <option value="approve">Approve Full Budget</option>
                                <option value="cutdown">Approve with Cut-down</option>
                                <option value="reject">Reject Project</option>
                              </select>
                            </div>
                            <div className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Final Sanctioned Amount (Rs. L)</label>
                              <input type="number" name="sanctioned_budget" step="0.1" defaultValue={project.proposed_budget || project.estimated_cost} required className="w-full input-field" />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Upload Financial Sanction / Rejection Memo (Required)</label>
                            <input type="file" name="document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white border border-[var(--border)] rounded bg-[var(--bg-card)] p-1.5" />
                          </div>
                          
                          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                            <CheckCircle size={18} /> Submit Financial Decision
                          </button>
                        </form>
                      </>
                    ) : activeStep.key === '8' ? (
                      <>
                        <div className="mb-4 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Final Administrative Review</h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                            <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)]">
                              <div className="text-[var(--text-muted)] text-xs mb-1">Asset Category</div>
                              <div className="font-bold">{project.asset_category || 'Road'}</div>
                            </div>
                            <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)]">
                              <div className="text-[var(--text-muted)] text-xs mb-1">Department</div>
                              <div className="font-bold truncate" title={project.department}>{project.department || 'R&B'}</div>
                            </div>
                            <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)]">
                              <div className="text-[var(--text-muted)] text-xs mb-1">Location / Start</div>
                              <div className="font-bold truncate">{project.location || project.start_point || '-'}</div>
                            </div>
                            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                              <div className="text-green-600 text-xs mb-1">Sanctioned Budget</div>
                              <div className="font-bold text-green-700 text-base">Rs. {project.estimated_cost} L</div>
                            </div>
                          </div>

                          <p className="text-xs text-[var(--text-secondary)] mb-4">Please review the financial sanction and all preceding clearances. Issue the final Administrative Approval Order to authorize Technical Sanction.</p>
                          
                          <form action={async (formData) => {
                             formData.append('role', role);
                             formData.append('docType', 'Admin Approval Order');
                             const { advanceProjectStep } = await import('@/app/actions');
                             await advanceProjectStep(project.id, activeStepIndex, formData);
                             setShowConfirmation(true);
                             setTimeout(() => setShowConfirmation(false), 5000);
                          }} className="space-y-4 border-t border-[var(--border)] pt-4">
                            <div>
                              <label className="block text-xs font-bold text-blue-500 mb-2">Upload Admin Approval Order (Required)</label>
                              <input type="file" name="document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white border border-[var(--border)] rounded bg-[var(--bg-card)] p-1.5" />
                            </div>
                            
                            <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)]">
                              <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                              <span className="font-medium">I officially approve this project on behalf of the Administrative Authority.</span>
                            </label>
                            
                            <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                              <CheckCircle size={18} /> Issue Administrative Approval
                            </button>
                          </form>
                        </div>
                      </>
                    ) : activeStep.key === '9' ? (
                      <>
                        <div className="mb-4 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Tender & Contract Award</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-4">Enter the details of the awarded contractor. This will assign the project for execution.</p>
                          <form action={async (formData) => {
                             formData.append('role', role);
                             const { assignContractorStep } = await import('@/app/actions');
                             await assignContractorStep(project.id, activeStepIndex, formData);
                             setShowConfirmation(true);
                             setTimeout(() => setShowConfirmation(false), 5000);
                          }} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-blue-500 mb-1">Contractor ID</label>
                                <input type="text" name="contractor_id" required className="w-full input-field" placeholder="e.g. CONT-123" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-blue-500 mb-1">Contractor Name</label>
                                <input type="text" name="contractor_name" required className="w-full input-field" placeholder="ABC Builders" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-blue-500 mb-1">Mobile No</label>
                                <input type="text" name="contractor_mobile" required className="w-full input-field" placeholder="9876543210" />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Upload Letter of Acceptance (LOA)</label>
                              <input type="file" name="document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white border border-[var(--border)] rounded bg-[var(--bg-card)] p-1.5" />
                            </div>
                            
                            <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                              <CheckCircle size={18} /> Award Contract & Assign Project
                            </button>
                          </form>
                        </div>
                      </>
                    ) : activeStep.key === '12' ? (
                      <>
                        {project.qc_status === 'failed' && (
                          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                            <h4 className="font-bold text-red-700 mb-1 flex items-center gap-2"><AlertTriangle size={18} /> QC Verification Failed</h4>
                            <p className="text-sm text-red-600 mb-2">The Quality Control Engineer has rejected your previous submission.</p>
                            <div className="bg-[var(--bg-card)] p-3 rounded border border-red-500/20 text-sm font-medium text-[var(--text-primary)]">
                              <strong>Reason for Rejection / Rework Required:</strong><br/>{project.qc_rejection_reason}
                            </div>
                            <p className="text-xs text-red-600 mt-2 font-bold">Please rectify the issues, complete the rework, and submit a new Completion Report and updated Road Photos.</p>
                          </div>
                        )}
                        <div className="mb-4 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Contractor Work Completion</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-4">Submit your final completion report and upload the post-construction road photos for quality control verification.</p>
                          <form action={async (formData) => {
                             formData.append('role', role);
                             const { submitWorkCompletionStep } = await import('@/app/actions');
                             await submitWorkCompletionStep(project.id, activeStepIndex, formData);
                             setShowConfirmation(true);
                             setTimeout(() => setShowConfirmation(false), 5000);
                          }} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Completion Report (Required)</label>
                                <input type="file" name="completion_report" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                              </div>
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Road Photos (Required)</label>
                                <input type="file" name="road_photos" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                              </div>
                            </div>
                            <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] mt-4">
                              <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                              <span className="font-medium">I certify that the physical work has been completed according to the BOQ and these photos accurately reflect the final outcome.</span>
                            </label>
                            
                            <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                              <CheckCircle size={18} /> Submit Completion & Request QC
                            </button>
                          </form>
                        </div>
                      </>
                    ) : activeStep.key === '13' ? (
                      <>
                        <div className="mb-4 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Quality Control Verification</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-4">Review the contractor's completion report and photos. Upload test reports and issue a final satisfactory or non-satisfactory ruling.</p>
                          <form action={async (formData) => {
                             formData.append('role', role);
                             const { submitQcVerificationStep } = await import('@/app/actions');
                             await submitQcVerificationStep(project.id, activeStepIndex, formData);
                             setShowConfirmation(true);
                             setTimeout(() => setShowConfirmation(false), 5000);
                          }} className="space-y-4">
                            
                            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-blue-500 mb-2">Primary QC Inspection Report (Required)</label>
                              <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                  <input type="text" name="qc_report_name" placeholder="Report Name (e.g., Final QC Audit Report)" required className="w-full text-sm bg-[var(--bg-body)] border border-[var(--border)] p-2 rounded-md" />
                                </div>
                                <div className="flex-1">
                                  <input type="file" name="qc_report" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                              <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-bold text-[var(--text-primary)]">Additional Test Reports (e.g., Core Test, Bitumen Test)</label>
                                <button type="button" onClick={() => setExtraQcDocs([...extraQcDocs, { id: Date.now() }])} className="text-xs bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-500/20 font-semibold transition-colors">+ Add Test Report</button>
                              </div>
                              {extraQcDocs.map((doc, i) => (
                                <div key={doc.id} className="flex gap-3 mb-3 items-end">
                                  <div className="flex-1">
                                    <input type="text" name={`extra_name_${i}`} placeholder="Test Name (e.g. Core Density Test)" required className="w-full text-sm bg-[var(--bg-body)] border border-[var(--border)] p-2 rounded-md" />
                                  </div>
                                  <div className="flex-1">
                                    <input type="file" name={`extra_file_${i}`} required className="w-full text-xs text-[var(--text-secondary)] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[var(--border)] file:text-[var(--text-primary)]" />
                                  </div>
                                  <button type="button" onClick={() => setExtraQcDocs(extraQcDocs.filter(d => d.id !== doc.id))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md">X</button>
                                </div>
                              ))}
                              {extraQcDocs.length === 0 && <div className="text-xs text-[var(--text-muted)] italic">No additional test reports added.</div>}
                              <input type="hidden" name="extra_count" value={extraQcDocs.length} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Overall Decision</label>
                                <select name="decision" required className="w-full input-field font-semibold" onChange={(e) => setQcDecision(e.target.value)}>
                                  <option value="">-- Select Decision --</option>
                                  <option value="approve">Satisfactory (Approve & Proceed to Billing)</option>
                                  <option value="reject">Not Satisfactory (Reject & Send Back to Contractor)</option>
                                </select>
                              </div>
                            </div>
                            
                            {qcDecision === 'reject' && (
                              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                                <label className="block text-sm font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Reason for Rejection / Issues to Fix</label>
                                <textarea name="rejection_reason" required className="w-full bg-[var(--bg-card)] border border-red-500/30 p-3 rounded-lg text-sm min-h-[100px] focus:ring-red-500 focus:border-red-500" placeholder="Describe the defects, failed test parameters, or specific areas the contractor needs to rework..."></textarea>
                              </div>
                            )}

                            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md mt-4">
                              <CheckCircle size={18} /> Submit QC Ruling
                            </button>
                          </form>
                        </div>
                      </>
                    ) : activeStep.key === '14' ? (
                      <>
                        <div className="mb-4 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Measurement & Billing</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-4">Process the payment for the contractor based on the verified measurements. Enter the payment amount and upload the corresponding bill.</p>
                          
                          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                              <div className="text-xs font-bold text-blue-600 mb-1">Total Sanctioned Budget</div>
                              <div className="text-xl font-black text-[var(--text-primary)]">Rs. {project.estimated_cost} L</div>
                            </div>
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <div className="text-xs font-bold text-green-600 mb-1">Paid So Far</div>
                              <div className="text-xl font-black text-[var(--text-primary)]">Rs. {project.spent_cost || 0} L</div>
                            </div>
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <div className="text-xs font-bold text-yellow-600 mb-1">Remaining Balance</div>
                              <div className="text-xl font-black text-[var(--text-primary)]">Rs. {Math.max(0, project.estimated_cost - (project.spent_cost || 0)).toFixed(2)} L</div>
                            </div>
                          </div>

                          <form action={async (formData) => {
                             formData.append('role', role);
                             const { submitBillingStep } = await import('@/app/actions');
                             await submitBillingStep(project.id, activeStepIndex, formData);
                             setShowConfirmation(true);
                             setTimeout(() => setShowConfirmation(false), 5000);
                          }} className="space-y-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Payment Amount (Rs. L)</label>
                                <input type="number" name="payment_amount" step="0.01" required max={project.estimated_cost - (project.spent_cost || 0)} className="w-full input-field font-bold text-lg" placeholder="0.00" />
                              </div>
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Upload Bill / Invoice (Required)</label>
                                <input type="file" name="bill_document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                              </div>
                            </div>

                            <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] mt-4">
                              <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                              <span className="font-medium">I certify that the measurements are verified and I authorize this payment. The project financials will be updated.</span>
                            </label>

                            <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md mt-4">
                              <CheckCircle size={18} /> Process Payment & Forward
                            </button>
                          </form>
                        </div>
                      </>
                    ) : activeStep.key === '16' ? (
                      <>
                        <div className="mb-4 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">Post-Construction Maintenance & Inspection</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-4">Conduct a periodic maintenance check. Select the maintenance period, upload the inspection report and photos, then update the condition index.</p>
                          
                          <form action={async (formData) => {
                             formData.append('role', role);
                             const { submitMaintenanceStep } = await import('@/app/actions');
                             await submitMaintenanceStep(project.id, activeStepIndex, formData);
                             setShowConfirmation(true);
                             setTimeout(() => setShowConfirmation(false), 5000);
                          }} className="space-y-4">
                            
                            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-orange-600 mb-2">Maintenance Period *</label>
                              <select name="maintenance_period" required className="w-full input-field font-bold text-sm">
                                <option value="">-- Select Period --</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="5 Years">5 Years</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Maintenance Inspection Report *</label>
                                <input type="file" name="maintenance_report" required className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                              </div>
                              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                <label className="block text-xs font-bold text-blue-500 mb-2">Current Site / Defect Photos *</label>
                                <input type="file" name="maintenance_photos" required multiple className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                              </div>
                            </div>

                            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                              <label className="block text-sm font-bold text-orange-700 mb-2">Update Asset Condition Metric</label>
                              <p className="text-xs text-orange-600 mb-3">Rate the current structural and functional condition (0-100). Higher is better.</p>
                              <input type="number" name="new_rci" required min="0" max="100" defaultValue={project.rci || 100} className="w-full input-field font-bold text-lg text-orange-700" />
                            </div>

                            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                              <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">Notes / Observations</label>
                              <textarea name="maintenance_notes" className="w-full input-field text-sm min-h-[80px]" placeholder="Describe road/building condition, cracks, potholes, water damage, etc..."></textarea>
                            </div>

                            <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] mt-4">
                              <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                              <span className="font-medium">I certify that the maintenance audit is completed and the recorded condition accurately reflects the on-site reality.</span>
                            </label>

                            <button type="submit" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md mt-4">
                              <CheckCircle size={18} /> Submit Maintenance Report
                            </button>
                          </form>
                        </div>

                        {/* Maintenance History Timeline */}
                        {project.maintenance_records && project.maintenance_records.length > 0 && (
                          <div className="mt-6 p-5 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl shadow-sm">
                            <h4 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
                              <Clock size={18} className="text-orange-500" /> Maintenance History ({project.maintenance_records.length} Records)
                            </h4>
                            <div className="space-y-4">
                              {project.maintenance_records.map((rec, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border ${rec.rci >= 70 ? 'bg-green-500/5 border-green-500/20' : rec.rci >= 40 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-3">
                                      <span className="px-3 py-1 bg-orange-500/20 text-orange-700 text-xs font-bold rounded-full border border-orange-500/30">{rec.period}</span>
                                      <span className="text-xs text-[var(--text-muted)]">{new Date(rec.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className={`text-sm font-bold ${rec.rci >= 70 ? 'text-green-600' : rec.rci >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {project.asset_category === 'Building' || project.asset_category === 'Bridge' ? 'Score' : 'RCI'}: {rec.rci}/100
                                    </div>
                                  </div>
                                  {rec.notes && <p className="text-sm text-[var(--text-secondary)] mb-3 italic">&ldquo;{rec.notes}&rdquo;</p>}
                                  <div className="flex flex-wrap gap-2">
                                    {rec.report_name && (
                                      <span className="text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-1 rounded flex items-center gap-1">
                                        <FileText size={12} /> {rec.report_name}
                                      </span>
                                    )}
                                    {rec.photo_count > 0 && (
                                      <span className="text-xs bg-purple-500/10 text-purple-600 border border-purple-500/20 px-2 py-1 rounded">
                                        📷 {rec.photo_count} Photo{rec.photo_count > 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Please upload the <strong>{activeStep.docReq}</strong> to complete your stage and forward the project to the next department.</p>
                        
                        <form action={async (formData) => {
                           formData.append('docType', activeStep.docReq);
                           formData.append('role', role);
                           const { advanceProjectStep } = await import('@/app/actions');
                           await advanceProjectStep(project.id, activeStepIndex, formData);
                           setShowConfirmation(true);
                           setTimeout(() => setShowConfirmation(false), 5000);
                        }} className="space-y-4">
                          <div>
                            <input type="file" name="document" required className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] p-2" />
                          </div>
                          
                          <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer bg-[var(--bg-body)] p-3 rounded-lg border border-[var(--border)]">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="font-medium">I confirm that I have uploaded all required documents, completed the necessary inspections, and certify that all information is true and accurate.</span>
                          </label>
                          
                          <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md">
                            <CheckCircle size={18} /> Submit & Forward Project
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            {showConfirmation && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl flex items-center gap-3 animate-pulse">
                <CheckCircle size={20} />
                <span className="font-medium">Successfully uploaded! The project has been securely forwarded to the next department.</span>
              </div>
            )}

            {documents.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><FileText size={18} /> Available Documents</h3>
                <div className="space-y-6">
                  {Object.entries(docsByOffice).map(([office, docs]) => (
                    <div key={office} className="bg-[var(--bg-body)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                      <div className="bg-[var(--bg-card)] px-4 py-3 border-b border-[var(--border)] font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                        <UploadCloud size={16} className="text-blue-500" /> Uploaded by: {office}
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {docs.map(doc => (
                          <div key={doc.id} className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg flex justify-between items-center hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
                                <FileText size={16} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[200px]">{doc.name}</div>
                                <div className="text-xs text-[var(--text-muted)] mt-0.5">{doc.type}</div>
                              </div>
                            </div>
                            <button onClick={() => {
                              if (doc.url) window.open(doc.url, '_blank');
                              else setViewDocument(doc);
                            }} className="text-xs text-blue-500 hover:underline font-medium px-3 py-1.5 bg-blue-500/10 rounded-md transition-colors">View</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY / WORKFLOW */}
        {activeTab === 'history' && (
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Clock size={18} /> Project Workflow Timeline</h3>
            <div className="text-sm text-[var(--text-secondary)] mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              This workflow strictly enforces role-based progression. You can only act on stages assigned to your role.
            </div>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
              {WORKFLOW_STEPS.map((step, idx) => {
                // Use real progress logic from the database
                const activeStepIndex = project.current_step !== undefined ? project.current_step : 0; 
                const isCompleted = idx < activeStepIndex; 
                const isActive = idx === activeStepIndex;
                const isAuthorized = step.roles.includes(role);

                // Do not show steps that come after the active step
                if (idx > activeStepIndex) return null;

                return (
                  <div key={step.key} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-card)] ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-[var(--border)]'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10`}>
                      {isCompleted ? <CheckCircle size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-[var(--bg-card)]"></div>}
                    </div>
                    
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] ${isActive ? 'bg-blue-500/5 border-blue-500/30 shadow-md' : 'bg-[var(--bg-body)]'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold ${isCompleted ? 'text-[var(--text-primary)]' : isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`}>
                          Step {step.key}: {step.label}
                        </h4>
                        {isCompleted && <span className="text-xs text-green-500 font-medium">Completed</span>}
                      </div>
                      
                      <div className="text-xs text-[var(--text-secondary)] mb-3">
                        <span className="font-semibold text-[var(--text-primary)]">Assigned Actors: </span>
                        {step.roles.map(r => r.replace('_', ' ')).join(', ')}
                      </div>

                      {isActive && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                          {isAuthorized ? (
                            <form className="space-y-3" action={async (formData) => {
                               // Client-side call to the server action
                               formData.append('docType', step.docReq);
                               formData.append('role', role);
                               const { advanceProjectStep } = await import('@/app/actions');
                               await advanceProjectStep(project.id, activeStepIndex, formData);
                            }}>
                              <div>
                                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                                  Required Document: {step.docReq}
                                </label>
                                <input type="file" name="document" required className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 border border-[var(--border)] rounded bg-[var(--bg-card)] p-1" />
                              </div>
                              <button type="submit" className="w-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-2">
                                <CheckCircle size={14} /> Approve & Forward
                              </button>
                            </form>
                          ) : (
                            <div className="text-xs text-red-500 flex items-center gap-1 bg-red-500/10 p-2 rounded border border-red-500/20">
                              <Info size={14} /> Awaiting action from {step.roles.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><FileText size={18} /> Project Documents</h3>
              {role !== 'admin' ? (
                <form action={async (formData) => {
                  const { uploadGeneralDocument } = await import('@/app/actions');
                  formData.append('role', role);
                  await uploadGeneralDocument(project.id, formData);
                }}>
                  <input type="file" name="document" id="general-upload" className="hidden" onChange={(e) => {
                    if (e.target.files.length > 0) e.target.form.requestSubmit();
                  }} />
                  <label htmlFor="general-upload" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    <UploadCloud size={16} /> Upload Report / Document
                  </label>
                </form>
              ) : (
                <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-body)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                  Admin: Review Mode Only (Upload Disabled)
                </span>
              )}
            </div>

            <div className="space-y-6">
              {Object.keys(docsByOffice).length > 0 ? (
                Object.entries(docsByOffice).map(([office, docs]) => (
                  <div key={office} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                    <div className="bg-[var(--bg-body)] px-4 py-3 border-b border-[var(--border)] font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <FileText size={16} className="text-blue-500"/> Office: {office}
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[var(--bg-card)] border-b border-[var(--border)]">
                          <th className="p-3 text-xs font-semibold text-[var(--text-muted)]">Document Name</th>
                          <th className="p-3 text-xs font-semibold text-[var(--text-muted)]">Type</th>
                          <th className="p-3 text-xs font-semibold text-[var(--text-muted)]">Status</th>
                          <th className="p-3 text-xs font-semibold text-[var(--text-muted)] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {docs.map(doc => (
                          <tr key={doc.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-body)] transition-colors">
                            <td className="p-3 font-medium text-[var(--text-primary)] flex items-center gap-2">
                              <FileText size={16} className="text-blue-500" />
                              {doc.name}
                            </td>
                            <td className="p-3 text-sm text-[var(--text-secondary)]">{doc.type}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${doc.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button onClick={() => {
                                if (doc.url) window.open(doc.url, '_blank');
                                else setViewDocument(doc);
                              }} className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white transition-colors">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-[var(--text-muted)] bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                  No documents have been uploaded for this project yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* BRIDGES */}
        {activeTab === 'bridges' && (
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Bridge size={18} /> Associated Bridges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bridges.map(b => (
                <div key={b.id} className="p-5 border border-[var(--border)] rounded-xl bg-[var(--bg-body)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-[var(--text-primary)]">{b.name}</h4>
                      <div className="text-sm text-[var(--text-muted)] mt-1">{b.type.toUpperCase()} | {b.total_length}m</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-500 rounded uppercase">{b.status}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">Condition Score</span>
                      <span className={`font-bold ${b.condition_score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{b.condition_score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div className={`h-full ${b.condition_score > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${b.condition_score}%` }}></div>
                    </div>
                  </div>

                  <h5 className="font-semibold text-[var(--text-primary)] mb-2 text-sm">Clearances & Approvals</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <input type="checkbox" defaultChecked className="rounded text-blue-500" /> Environmental
                    </label>
                    <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <input type="checkbox" defaultChecked={b.type==='psc'} className="rounded text-blue-500" /> Coastal (CRZ)
                    </label>
                    <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <input type="checkbox" defaultChecked className="rounded text-blue-500" /> Railway (ROB)
                    </label>
                    <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <input type="checkbox" className="rounded text-blue-500" /> Forest Dept
                    </label>
                    <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <input type="checkbox" defaultChecked className="rounded text-blue-500" /> Utility Shifting
                    </label>
                    <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <input type="checkbox" defaultChecked className="rounded text-blue-500" /> Land Acquisition
                    </label>
                  </div>
                </div>
              ))}
              {bridges.length === 0 && <div className="text-[var(--text-muted)] col-span-2">No bridges linked to this project.</div>}
            </div>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewDocument && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] w-full max-w-4xl h-full max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[var(--border)] animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-[var(--border)] bg-[var(--bg-body)]">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" size={24} />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">{viewDocument.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{viewDocument.type} • Uploaded by {ROLES[viewDocument.uploadedBy]?.label || viewDocument.uploadedBy}</p>
                </div>
              </div>
              <button onClick={() => setViewDocument(null)} className="p-2 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors font-bold text-[var(--text-muted)]">
                Close Viewer
              </button>
            </div>
            <div className="flex-1 bg-black/5 dark:bg-black/40 p-4 sm:p-8 flex items-center justify-center overflow-auto">
              <div className="bg-white dark:bg-zinc-800 w-full max-w-2xl min-h-full shadow-lg p-12 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center border border-gray-200 dark:border-zinc-700">
                <FileText size={64} className="mb-6 opacity-30 text-blue-500" />
                <h2 className="text-2xl font-bold mb-3 text-gray-700 dark:text-gray-300">Simulated Document Viewer</h2>
                <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-mono text-sm mb-6 max-w-full truncate">
                  {viewDocument.name}
                </div>
                <p className="text-sm max-w-md mx-auto leading-relaxed">Because this is a rapid prototype, file binaries are not physically saved to the database to conserve resources. In a full production environment, this window would embed the actual PDF, Image, or Word Document.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
