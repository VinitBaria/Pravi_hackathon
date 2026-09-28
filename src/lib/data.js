export const ROLES = {
  admin: { label: 'System Administrator (Project Creator)', group: 'admin' },
  engineer: { label: 'Engineering Officer', group: 'execution' },
  surveyor: { label: 'Surveyor / GIS team', group: 'execution' },
  dpr: { label: 'DPR consultant / design consultant', group: 'execution' },
  planning: { label: 'Planning / land / utility-clearance team', group: 'admin' },
  asset_mgr: { label: 'Asset Manager / Asset Inventory Officer', group: 'admin' },
  finance: { label: 'Budget / Finance Officer', group: 'admin' },
  admin_approver: { label: 'Administrative Approving Authority', group: 'admin' },
  procurement: { label: 'Procurement / Tender Officer', group: 'admin' },
  contractor: { label: 'Contractor / construction agency', group: 'execution' },
  qc: { label: 'Quality-Control Engineer / laboratory', group: 'execution' },
  accounts: { label: 'Accounts / Payment Officer', group: 'admin' },
  maintenance: { label: 'Maintenance & Operations Agency', group: 'execution' }
};

export const WORKFLOW_STEPS = [
  { key: '1', label: 'Report Issue / Request', roles: ['admin'], docReq: 'Initial Request Form' },
  { key: '2', label: 'Engineering Field Report & Proposal', roles: ['engineer'], docReq: 'Inspection, Proposal & Estimate Report' },
  { key: '3', label: 'GIS Mapping & Spatial Analysis', roles: ['surveyor'], docReq: 'GIS Mapping Data' },
  { key: '4', label: 'DPR Consultant: Detailed Reports', roles: ['dpr'], docReq: 'DPR, Soil & Traffic Reports' },
  { key: '5', label: 'Planning & Utility Clearances', roles: ['planning'], docReq: 'Land & Environmental Documents' },
  { key: '6', label: 'Asset Manager Pre-Approval', roles: ['asset_mgr'], docReq: 'Asset Impact & Inventory Check' },
  { key: '7', label: 'Financial Sanction', roles: ['finance'], docReq: 'Financial Sanction Letter' },
  { key: '8', label: 'Administrative Prioritisation & Approval', roles: ['admin', 'admin_approver'], docReq: 'Admin Approval Order' },
  { key: '9', label: 'Tender & Contract Award', roles: ['procurement'], docReq: 'Letter of Acceptance (LOA)' },
  { key: '10', label: 'Execution Setup', roles: ['contractor'], docReq: 'Work Order & Setup Photos' },
  { key: '11', label: 'Construction Monitoring', roles: ['contractor'], docReq: 'Measurement Book (MB)' },
  { key: '12', label: 'Contractor Work Completion', roles: ['contractor'], docReq: 'Completion Report & Road Photos' },
  { key: '13', label: 'Quality Control Verification', roles: ['qc'], docReq: 'QC Inspection Report' },
  { key: '14', label: 'Measurement & Billing', roles: ['finance', 'accounts'], docReq: 'Final Bill' },
  { key: '15', label: 'Asset Registry Update', roles: ['surveyor', 'asset_mgr'], docReq: 'Updated GIS Coordinates' },
  { key: '16', label: 'Post-Construction Maintenance (6M / 1Y)', roles: ['maintenance'], docReq: 'Maintenance Inspection Report' }
];
