'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

async function saveFileLocally(file) {
  if (!file || !file.name || file.size === 0) return null;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${uniqueName}`;
  } catch (err) {
    console.error('File save error:', err);
    return null;
  }
}

export async function createProject(formData) {
  const db = await getDb();
  
  // Generate a mock unique ID
  const newId = `PRJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  const newProject = {
    id: newId,
    asset_id: formData.get('asset_id'),
    govt: formData.get('govt'),
    department: formData.get('department'),
    asset_category: formData.get('asset_category'),
    name: formData.get('name'),
    type: formData.get('type'),
    start_point: formData.get('start_point') || null,
    end_point: formData.get('end_point') || null,
    length: parseFloat(formData.get('length')) || 0,
    location: formData.get('location') || null,
    area: parseFloat(formData.get('area')) || 0,
    floors: parseInt(formData.get('floors')) || 0,
    estimated_cost: parseFloat(formData.get('cost')) || 0,
    description: formData.get('description'),
    status: 'draft', // start at the beginning of workflow
    current_step: 1, // Step 1 is creating the project, so it automatically jumps to Step 2
    progress: 0,
    rci: 100, // default perfect RCI for new project
    spent_cost: 0,
    coordinates: '[]',
    created_at: new Date().toISOString()
  };

  await db.collection('projects').insertOne(newProject);
  
  revalidatePath('/projects');
  redirect('/projects');
}

export async function advanceProjectStep(projectId, currentStep, formData) {
  const db = await getDb();
  
  // If a document was uploaded, save its metadata to the documents collection
  if (formData) {
    const file = formData.get('document');
    if (file && file.name && file.size > 0) {
      const fileUrl = await saveFileLocally(file);
      const docRecord = {
        id: `DOC-${Date.now()}`,
        project_id: projectId,
        name: file.name,
        type: formData.get('docType') || 'Workflow Document',
        uploadedBy: formData.get('role') || 'System User',
        status: 'approved',
        url: fileUrl,
        date: new Date().toISOString()
      };
      await db.collection('documents').insertOne(docRecord);
    }
  }

  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { current_step: currentStep + 1 } }
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function advanceDprStep(projectId, currentStep, formData) {
  const db = await getDb();
  const role = formData.get('role');
  
  const docsToInsert = [];
  
  const traffic = formData.get('traffic_report');
  if (traffic && traffic.size > 0) {
    const url = await saveFileLocally(traffic);
    docsToInsert.push({ id: `DOC-${Date.now()}-T`, project_id: projectId, name: traffic.name, type: 'Traffic Report', uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
  }
  
  const soil = formData.get('soil_report');
  if (soil && soil.size > 0) {
    const url = await saveFileLocally(soil);
    docsToInsert.push({ id: `DOC-${Date.now()}-S`, project_id: projectId, name: soil.name, type: 'Soil Report', uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
  }
  
  const extraCount = parseInt(formData.get('extra_count')) || 0;
  for (let i = 0; i < extraCount; i++) {
    const extraName = formData.get(`extra_name_${i}`);
    const extraFile = formData.get(`extra_file_${i}`);
    if (extraName && extraFile && extraFile.size > 0) {
      const url = await saveFileLocally(extraFile);
      docsToInsert.push({ id: `DOC-${Date.now()}-E${i}`, project_id: projectId, name: extraFile.name, type: extraName, uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
    }
  }
  
  if (docsToInsert.length > 0) {
    await db.collection('documents').insertMany(docsToInsert);
  }
  
  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { current_step: currentStep + 1 } }
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function advancePlanningStep(projectId, currentStep, formData) {
  const db = await getDb();
  const role = formData.get('role');
  
  const docsToInsert = [];
  
  const landDoc = formData.get('land_document');
  if (landDoc && landDoc.size > 0) {
    const url = await saveFileLocally(landDoc);
    docsToInsert.push({ id: `DOC-${Date.now()}-L`, project_id: projectId, name: landDoc.name, type: 'Land Document', uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
  }
  
  const envPerm = formData.get('env_permission');
  if (envPerm && envPerm.size > 0) {
    const url = await saveFileLocally(envPerm);
    docsToInsert.push({ id: `DOC-${Date.now()}-EN`, project_id: projectId, name: envPerm.name, type: 'Environmental Permission', uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
  }
  
  const extraCount = parseInt(formData.get('extra_count')) || 0;
  for (let i = 0; i < extraCount; i++) {
    const extraName = formData.get(`extra_name_${i}`);
    const extraFile = formData.get(`extra_file_${i}`);
    if (extraName && extraFile && extraFile.size > 0) {
      const url = await saveFileLocally(extraFile);
      docsToInsert.push({ id: `DOC-${Date.now()}-P${i}`, project_id: projectId, name: extraFile.name, type: extraName, uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
    }
  }
  
  if (docsToInsert.length > 0) {
    await db.collection('documents').insertMany(docsToInsert);
  }
  
  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { current_step: currentStep + 1 } }
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function advanceAssetManagerStep(projectId, currentStep, formData) {
  const db = await getDb();
  
  const proposedBudget = parseFloat(formData.get('proposed_budget')) || 0;
  
  const file = formData.get('document');
  if (file && file.name && file.size > 0) {
    const fileUrl = await saveFileLocally(file);
    const docRecord = {
      id: `DOC-${Date.now()}`,
      project_id: projectId,
      name: file.name,
      type: 'Asset Manager Budget Proposal',
      uploadedBy: formData.get('role'),
      status: 'approved',
      url: fileUrl,
      date: new Date().toISOString()
    };
    await db.collection('documents').insertOne(docRecord);
  }

  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { 
      current_step: currentStep + 1,
      proposed_budget: proposedBudget
    } }
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function advanceFinanceStep(projectId, currentStep, formData) {
  const db = await getDb();
  
  const decision = formData.get('decision');
  const sanctionedBudget = parseFloat(formData.get('sanctioned_budget')) || 0;
  
  const file = formData.get('document');
  if (file && file.name && file.size > 0) {
    const fileUrl = await saveFileLocally(file);
    const docRecord = {
      id: `DOC-${Date.now()}`,
      project_id: projectId,
      name: file.name,
      type: decision === 'reject' ? 'Rejection Memo' : 'Financial Sanction Letter',
      uploadedBy: formData.get('role'),
      status: decision === 'reject' ? 'rejected' : 'approved',
      url: fileUrl,
      date: new Date().toISOString()
    };
    await db.collection('documents').insertOne(docRecord);
  }

  if (decision === 'reject') {
    await db.collection('projects').updateOne(
      { id: projectId },
      { $set: { status: 'rejected' } } 
    );
  } else {
    await db.collection('projects').updateOne(
      { id: projectId },
      { $set: { 
        current_step: currentStep + 1,
        sanctioned_budget: sanctionedBudget,
        estimated_cost: sanctionedBudget
      } }
    );
  }
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function assignContractorStep(projectId, currentStep, formData) {
  const db = await getDb();
  
  const contractorId = formData.get('contractor_id');
  const contractorName = formData.get('contractor_name');
  const contractorMobile = formData.get('contractor_mobile');
  
  const file = formData.get('document');
  if (file && file.name && file.size > 0) {
    const fileUrl = await saveFileLocally(file);
    const docRecord = {
      id: `DOC-${Date.now()}`,
      project_id: projectId,
      name: file.name,
      type: 'Letter of Acceptance (LOA)',
      uploadedBy: formData.get('role'),
      status: 'approved',
      url: fileUrl,
      date: new Date().toISOString()
    };
    await db.collection('documents').insertOne(docRecord);
  }

  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { 
      current_step: currentStep + 1,
      contractor_id: contractorId,
      contractor_name: contractorName,
      contractor_mobile: contractorMobile,
      status: 'construction'
    } }
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function submitWorkCompletionStep(projectId, currentStep, formData) {
  const db = await getDb();
  const role = formData.get('role');
  
  const docsToInsert = [];
  
  const report = formData.get('completion_report');
  if (report && report.size > 0) {
    const url = await saveFileLocally(report);
    docsToInsert.push({ id: `DOC-${Date.now()}-CR`, project_id: projectId, name: report.name, type: 'Completion Report', uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
  }
  
  const photos = formData.get('road_photos');
  if (photos && photos.size > 0) {
    const url = await saveFileLocally(photos);
    docsToInsert.push({ id: `DOC-${Date.now()}-PH`, project_id: projectId, name: photos.name, type: 'Road Photos', uploadedBy: role, status: 'pending', url, date: new Date().toISOString() });
  }
  
  if (docsToInsert.length > 0) {
    await db.collection('documents').insertMany(docsToInsert);
  }
  
  // Update status to 'completed' as physical work is done, moving to QC and Billing
  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { 
      current_step: currentStep + 1,
      progress: 95
    } }
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function submitQcVerificationStep(projectId, currentStep, formData) {
  const db = await getDb();
  const role = formData.get('role');
  const decision = formData.get('decision');
  const rejectionReason = formData.get('rejection_reason');
  
  const docsToInsert = [];
  
  const primaryReport = formData.get('qc_report');
  const primaryReportName = formData.get('qc_report_name') || 'QC Inspection Report';
  if (primaryReport && primaryReport.size > 0) {
    const url = await saveFileLocally(primaryReport);
    docsToInsert.push({ id: `DOC-${Date.now()}-QC`, project_id: projectId, name: primaryReport.name, type: primaryReportName, uploadedBy: role, status: decision === 'reject' ? 'rejected' : 'approved', url, date: new Date().toISOString() });
  }
  
  const extraCount = parseInt(formData.get('extra_count')) || 0;
  for (let i = 0; i < extraCount; i++) {
    const extraName = formData.get(`extra_name_${i}`);
    const extraFile = formData.get(`extra_file_${i}`);
    if (extraName && extraFile && extraFile.size > 0) {
      const url = await saveFileLocally(extraFile);
      docsToInsert.push({ id: `DOC-${Date.now()}-QCE${i}`, project_id: projectId, name: extraFile.name, type: extraName, uploadedBy: role, status: decision === 'reject' ? 'rejected' : 'approved', url, date: new Date().toISOString() });
    }
  }
  
  if (docsToInsert.length > 0) {
    await db.collection('documents').insertMany(docsToInsert);
  }
  
  if (decision === 'reject') {
    const { WORKFLOW_STEPS } = await import('@/lib/data');
    const returnIndex = WORKFLOW_STEPS.findIndex(s => s.key === '12');
    
    await db.collection('projects').updateOne(
      { id: projectId },
      { $set: { 
        current_step: returnIndex,
        qc_status: 'failed',
        qc_rejection_reason: rejectionReason,
        progress: 85
      } }
    );
  } else {
    await db.collection('projects').updateOne(
      { id: projectId },
      { $set: { 
        current_step: currentStep + 1,
        qc_status: 'passed',
        qc_rejection_reason: null,
        progress: 100
      } }
    );
  }
  
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function submitBillingStep(projectId, currentStep, formData) {
  const db = await getDb();
  const role = formData.get('role');
  const paymentAmount = parseFloat(formData.get('payment_amount')) || 0;
  
  const billDoc = formData.get('bill_document');
  if (billDoc && billDoc.size > 0) {
    const url = await saveFileLocally(billDoc);
    await db.collection('documents').insertOne({ 
      id: `DOC-${Date.now()}-BILL`, 
      project_id: projectId, 
      name: billDoc.name, 
      type: 'Payment Bill / Receipt', 
      uploadedBy: role, 
      status: 'approved', 
      url, 
      date: new Date().toISOString() 
    });
  }
  
  await db.collection('projects').updateOne(
    { id: projectId },
    { 
      $inc: { spent_cost: paymentAmount },
      $set: { current_step: currentStep + 1 } 
    }
  );
  
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}

export async function submitMaintenanceStep(projectId, currentStep, formData) {
  const db = await getDb();
  const role = formData.get('role');
  const newRci = parseInt(formData.get('new_rci'), 10) || 100;
  const period = formData.get('maintenance_period') || '6 Months';
  const notes = formData.get('maintenance_notes') || '';
  
  const docsToInsert = [];
  let reportName = '';
  
  const reportDoc = formData.get('maintenance_report');
  if (reportDoc && reportDoc.size > 0) {
    const url = await saveFileLocally(reportDoc);
    reportName = reportDoc.name;
    docsToInsert.push({ 
      id: `DOC-${Date.now()}-MAINT-RPT`, 
      project_id: projectId, 
      name: reportDoc.name, 
      type: `Maintenance Report (${period})`, 
      uploadedBy: role, 
      status: 'approved', 
      url, 
      date: new Date().toISOString() 
    });
  }
  
  const photoDocs = formData.getAll('maintenance_photos');
  let photoCount = 0;
  for (const photo of photoDocs) {
    if (photo && photo.size > 0) {
      photoCount++;
      const url = await saveFileLocally(photo);
      docsToInsert.push({ 
        id: `DOC-${Date.now()}-MAINT-PH${photoCount}`, 
        project_id: projectId, 
        name: photo.name, 
        type: `Site Photo (${period})`, 
        uploadedBy: role, 
        status: 'approved', 
        url, 
        date: new Date().toISOString() 
      });
    }
  }
  
  if (docsToInsert.length > 0) {
    await db.collection('documents').insertMany(docsToInsert);
  }
  
  // Build the maintenance record
  const maintenanceRecord = {
    period,
    date: new Date().toISOString(),
    rci: newRci,
    notes,
    report_name: reportName,
    photo_count: photoCount,
    submitted_by: role
  };
  
  // Push to maintenance_records array and update RCI. Step stays at 16 for future checks.
  await db.collection('projects').updateOne(
    { id: projectId },
    { 
      $set: { 
        rci: newRci,
        status: 'Active / Under Maintenance'
      },
      $push: {
        maintenance_records: maintenanceRecord
      }
    }
  );
  
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
  revalidatePath('/dashboard');
}

export async function uploadGeneralDocument(projectId, formData) {
  const db = await getDb();
  const file = formData.get('document');
  
  if (file && file.name && file.size > 0) {
    const url = await saveFileLocally(file);
    const docRecord = {
      id: `DOC-${Date.now()}`,
      project_id: projectId,
      name: file.name,
      type: 'General Report',
      uploadedBy: formData.get('role') || 'System User',
      status: 'pending',
      url,
      date: new Date().toISOString()
    };
    await db.collection('documents').insertOne(docRecord);
  }
  revalidatePath(`/projects/${projectId}`);
}

export async function saveGISMapping(projectId, coordinatesJSON, formData, isFinal, isClear = false) {
  const db = await getDb();
  
  // 1. Update coordinates (if clear, empty array)
  await db.collection('projects').updateOne(
    { id: projectId },
    { $set: { coordinates: isClear ? '[]' : coordinatesJSON } }
  );

  // 2. Upload Document if provided
  const file = formData ? formData.get('document') : null;
  if (file && file.name && file.size > 0) {
    const url = await saveFileLocally(file);
    const docRecord = {
      id: `DOC-${Date.now()}`,
      project_id: projectId,
      name: file.name,
      type: 'GIS Mapping Data',
      uploadedBy: 'surveyor',
      status: 'pending',
      url,
      date: new Date().toISOString()
    };
    await db.collection('documents').insertOne(docRecord);
  }

  // 3. If Final Submission, advance workflow
  if (isFinal) {
    const project = await db.collection('projects').findOne({ id: projectId });
    if (project && project.current_step !== undefined) {
      await db.collection('projects').updateOne(
        { id: projectId },
        { $set: { current_step: project.current_step + 1 } }
      );
    }
  }

  revalidatePath('/gis');
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
}
