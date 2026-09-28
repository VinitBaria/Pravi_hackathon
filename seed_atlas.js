const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://vinitbaria2006_db_user:pwCA97wnGwoueZbj@cluster1.2f2vsux.mongodb.net/roadworks?retryWrites=true&w=majority&appName=Cluster1';

async function seed() {
  console.log('Connecting to MongoDB Atlas at:', uri.replace(/:([^:@]+)@/, ':****@'));
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('roadworks');

  console.log('Clearing existing collections...');
  await db.collection('projects').deleteMany({});
  await db.collection('bridges').deleteMany({});
  await db.collection('documents').deleteMany({});

  const projects = [
    {
      id: 'PRJ-875',
      name: 'Sardar Patel Smart Administrative Complex',
      project_type: 'building',
      govt: 'State Government',
      department: 'Roads & Buildings Department (R&B)',
      asset_category: 'Commercial / Institutional Building',
      type: 'building',
      location: 'Rajkot Civic Center Hub, Ward 7',
      area: 32000,
      floors: 6,
      estimated_cost: 4500,
      spent_cost: 4350,
      progress: 100,
      rci: 94,
      status: 'Active / Under Maintenance',
      current_step: 16,
      description: 'Modern 6-storey energy-efficient administrative complex featuring smart building management systems and green certification.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Rajesh Patel (ID: ENG-402)',
        surveyor: 'Kishan Dave - GeoTech GIS (ID: GIS-108)',
        dpr: 'InfraConsult Design Partners (ID: DPR-330)',
        planning: 'Urban Development & Clearances Authority (ID: PLN-115)',
        asset_mgr: 'Smt. Ananya Desai (ID: AST-521)',
        finance: 'State Infrastructure Finance Dept (ID: FIN-880)',
        procurement: 'Gujarat Tenders & Contracts Cell (ID: PRC-204)',
        contractor: 'Shreeji Mega Structures Pvt Ltd (ID: CON-771)',
        qc: 'National Quality & Testing Laboratory (ID: QC-605)',
        accounts: 'Treasury & Accounts Directorate (ID: ACC-419)',
        maintenance: 'Apex Facility & Civil Maintenance Group (ID: MNT-102)'
      },
      coordinates: JSON.stringify([
        [22.3039, 70.8022],
        [22.3045, 70.8035],
        [22.3055, 70.8028],
        [22.3048, 70.8015],
        [22.3039, 70.8022]
      ]),
      maintenance_records: [
        {
          period: '6 Months',
          date: '2026-03-15',
          new_rci: 96,
          notes: 'Routine 6-month structural and MEP inspection completed. Building exterior and interior structural elements in pristine condition. No water seepage detected.',
          photos: ['/uploads/sample-inspect-1.jpg', '/uploads/sample-inspect-2.jpg'],
          report: '6_Month_Audit_Report.pdf',
          submitted_at: '2026-03-15T10:30:00.000Z'
        },
        {
          period: '1 Year',
          date: '2026-09-20',
          new_rci: 94,
          notes: 'Annual building performance audit. HVAC, fire suppression, solar panel arrays, and structural load points tested and verified satisfactory.',
          photos: ['/uploads/sample-inspect-3.jpg'],
          report: 'Annual_Maintenance_Review_2026.pdf',
          submitted_at: '2026-09-20T14:45:00.000Z'
        }
      ],
      created_at: new Date('2025-01-10').toISOString()
    },
    {
      id: 'PRJ-001',
      name: 'NH-48 6-Lane Expressway Expansion',
      project_type: 'road',
      govt: 'Central Government',
      department: 'National Highways Authority (NHAI)',
      asset_category: 'National Highway',
      type: 'road',
      start_point: 'Rajkot Bypass Ch: 24+000',
      end_point: 'Chotila Junction Ch: 69+500',
      length: 45.5,
      width: 24,
      estimated_cost: 12500,
      spent_cost: 8125,
      progress: 65,
      rci: 72,
      status: 'construction',
      current_step: 11,
      description: 'High-speed 6-lane bituminous concrete corridor widening with grade-separated interchanges, advanced drainage, and solar illumination.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Hardik Shah (ID: ENG-312)',
        surveyor: 'Gujarat Aerial Survey & GIS Team (ID: GIS-440)',
        dpr: 'L&T Infrastructure Engineering (ID: DPR-512)',
        planning: 'State Land Acquisition Cell (ID: PLN-302)',
        asset_mgr: 'National Highway Asset Cell (ID: AST-209)',
        finance: 'MoRTH Finance Division (ID: FIN-104)',
        procurement: 'Central Procurement Board (ID: PRC-601)',
        contractor: 'Patel Highway Construction Consortium (ID: CON-882)'
      },
      coordinates: JSON.stringify([
        [22.3039, 70.8022],
        [22.3150, 70.8100],
        [22.3300, 70.8250],
        [22.3500, 70.8400],
        [22.3720, 70.8650]
      ]),
      created_at: new Date('2025-03-12').toISOString()
    },
    {
      id: 'PRJ-002',
      name: 'Rajkot Smart Outer Ring Road Phase 2',
      project_type: 'road',
      govt: 'State Government',
      department: 'Roads & Buildings Department (R&B)',
      asset_category: 'State Ring Road',
      type: 'road',
      start_point: 'Kalawad Road Cross',
      end_point: 'Gondal Highway Node',
      length: 18.2,
      width: 20,
      estimated_cost: 4200,
      spent_cost: 650,
      progress: 25,
      rci: 42,
      status: 'tender',
      current_step: 9,
      description: '4-lane peripheral ring road to divert heavy commercial traffic around Rajkot metropolis, including smart tolling and wildlife underpasses.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Vikram Mehta (ID: ENG-209)',
        surveyor: 'GeoSpatial Analytics Unit (ID: GIS-319)',
        dpr: 'RITES Consultancy Ltd (ID: DPR-112)',
        planning: 'Urban Land Ceiling & Clearance Board (ID: PLN-401)',
        asset_mgr: 'RUDA Asset Wing (ID: AST-611)',
        finance: 'Municipal & State Finance Board (ID: FIN-302)',
        procurement: 'Tender Evaluation Committee (ID: PRC-550)'
      },
      coordinates: JSON.stringify([
        [22.2800, 70.7800],
        [22.2700, 70.7900],
        [22.2600, 70.8100],
        [22.2550, 70.8350]
      ]),
      created_at: new Date('2025-05-18').toISOString()
    },
    {
      id: 'PRJ-003',
      name: 'Aji River Cable-Stayed Iconic Bridge',
      project_type: 'bridge',
      govt: 'State Government',
      department: 'Roads & Buildings Department (R&B)',
      asset_category: 'Major River Bridge',
      type: 'bridge',
      location: 'Aji River Basin, East Rajkot',
      length: 1.2,
      width: 16,
      estimated_cost: 3500,
      spent_cost: 2800,
      progress: 80,
      rci: 85,
      status: 'construction',
      current_step: 12,
      description: 'Signature 4-lane cable-stayed bridge spanning Aji River, reducing commute times between industrial and residential sectors by 40 minutes.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Manoj Trivedi (ID: ENG-518)',
        surveyor: 'Hydrographic & Drone Survey Team (ID: GIS-205)',
        dpr: 'COWI Bridge Specialists (ID: DPR-802)',
        planning: 'Irrigation & River Protection Division (ID: PLN-220)',
        asset_mgr: 'Gujarat Bridge Registry (ID: AST-331)',
        finance: 'Infrastructure Development Board (ID: FIN-410)',
        procurement: 'Major Projects Tenders Wing (ID: PRC-119)',
        contractor: 'Afcons & Bridge Builders Joint Venture (ID: CON-905)'
      },
      coordinates: JSON.stringify([
        [22.3100, 70.8200],
        [22.3120, 70.8250],
        [22.3140, 70.8300]
      ]),
      created_at: new Date('2025-02-22').toISOString()
    },
    {
      id: 'PRJ-104',
      name: 'Kalawad Road Arterial Modernization',
      project_type: 'road',
      govt: 'Local Municipal Body',
      department: 'Rajkot Municipal Corporation (RMC)',
      asset_category: 'Urban Arterial Road',
      type: 'road',
      start_point: 'Kotecha Chowk',
      end_point: 'KKV Flyover Junction',
      length: 6.8,
      width: 14,
      estimated_cost: 1850,
      spent_cost: 185,
      progress: 15,
      rci: 35,
      status: 'draft',
      current_step: 3,
      description: 'Comprehensive road rehabilitation with dedicated bus rapid transit lanes, utility ducting, and anti-skid resurfacing in heavy traffic zones.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Sanjay Rathod (ID: ENG-108)',
        surveyor: 'Urban Drone & GIS Mapping Team (ID: GIS-602)'
      },
      coordinates: JSON.stringify([
        [22.2900, 70.7600],
        [22.2950, 70.7720],
        [22.3000, 70.7850]
      ]),
      created_at: new Date('2025-08-01').toISOString()
    },
    {
      id: 'PRJ-205',
      name: 'Morbi Ceramic Hub Heavy Freight Highway',
      project_type: 'road',
      govt: 'State Government',
      department: 'Roads & Buildings Department (R&B)',
      asset_category: 'Industrial Corridor',
      type: 'road',
      start_point: 'Morbi Bypass Gate',
      end_point: 'Maliya Port Connector',
      length: 32.0,
      width: 22,
      estimated_cost: 8900,
      spent_cost: 8010,
      progress: 90,
      rci: 88,
      status: 'construction',
      current_step: 13,
      description: 'Heavy-duty asphalt pavement engineered for heavy multi-axle freight trucks transporting ceramic goods to maritime container ports.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Dhaval Solanki (ID: ENG-445)',
        surveyor: 'Industrial GIS Mapping Division (ID: GIS-710)',
        dpr: 'Feedback Infra Consultants (ID: DPR-619)',
        planning: 'Industrial Corridor Clearance Wing (ID: PLN-503)',
        asset_mgr: 'State Asset Management Directorate (ID: AST-801)',
        finance: 'State Transport Finance Board (ID: FIN-920)',
        procurement: 'Gujarat State Highways Tenders (ID: PRC-301)',
        contractor: 'Sadbhav Engineering Works (ID: CON-664)',
        qc: 'National Road QC Laboratory (ID: QC-201)'
      },
      coordinates: JSON.stringify([
        [22.8100, 70.8300],
        [22.8400, 70.8500],
        [22.8700, 70.8800],
        [22.9000, 70.9100]
      ]),
      created_at: new Date('2025-04-05').toISOString()
    },
    {
      id: 'PRJ-306',
      name: 'Civil Hospital Multi-Specialty Trauma Wing',
      project_type: 'building',
      govt: 'State Government',
      department: 'Health & Family Welfare (R&B Wing)',
      asset_category: 'Healthcare Infrastructure',
      type: 'building',
      location: 'Civil Hospital Campus, Rajkot',
      area: 45000,
      floors: 8,
      estimated_cost: 6400,
      spent_cost: 640,
      progress: 30,
      rci: 90,
      status: 'approval',
      current_step: 7,
      description: '300-bed state-of-the-art trauma care and surgical superspecialty hospital block equipped with rooftop helipad and seismic-resistant design.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Amit Joshi (ID: ENG-881)',
        surveyor: 'GeoSpatial Survey Unit (ID: GIS-104)',
        dpr: 'Hospital Architecture & MEP Planners (ID: DPR-441)',
        planning: 'Pollution Control & Fire Safety Board (ID: PLN-312)',
        asset_mgr: 'Public Health Asset Registry (ID: AST-910)',
        finance: 'State Healthcare Infrastructure Fund (ID: FIN-665)'
      },
      coordinates: JSON.stringify([
        [22.3080, 70.7980],
        [22.3090, 70.7995],
        [22.3075, 70.8010],
        [22.3065, 70.7990],
        [22.3080, 70.7980]
      ]),
      created_at: new Date('2025-06-25').toISOString()
    },
    {
      id: 'PRJ-407',
      name: 'Nyari Dam Spillway Overpass Bridge',
      project_type: 'bridge',
      govt: 'State Government',
      department: 'Roads & Buildings Department (R&B)',
      asset_category: 'Dam Spillway Bridge',
      type: 'bridge',
      location: 'Nyari Dam Reservoir Perimeter',
      length: 0.45,
      width: 11,
      estimated_cost: 950,
      spent_cost: 950,
      progress: 100,
      rci: 88,
      status: 'Active / Under Maintenance',
      current_step: 16,
      description: 'Reinforced concrete deck bridge providing all-weather connectivity across the Nyari reservoir spillway channel.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Pratik Joshi (ID: ENG-224)',
        surveyor: 'Hydrological GIS Cell (ID: GIS-510)',
        dpr: 'Dam & Hydraulics Engineering Ltd (ID: DPR-778)',
        planning: 'Water Resources Dept Clearance (ID: PLN-612)',
        asset_mgr: 'State Bridge Inventory (ID: AST-403)',
        finance: 'Irrigation & R&B Joint Finance (ID: FIN-512)',
        procurement: 'Civil Works Procurement Cell (ID: PRC-882)',
        contractor: 'Shakti Infrastructure Projects (ID: CON-331)',
        qc: 'Bureau of Quality Assurance (ID: QC-992)',
        accounts: 'District Treasury Office (ID: ACC-701)',
        maintenance: 'Saurashtra Bridge Maintenance Agency (ID: MNT-404)'
      },
      coordinates: JSON.stringify([
        [22.2500, 70.7400],
        [22.2520, 70.7430],
        [22.2540, 70.7460]
      ]),
      maintenance_records: [
        {
          period: '6 Months',
          date: '2026-04-10',
          new_rci: 90,
          notes: '6-month scour depth analysis and bearing inspection completed. Expansion joints cleaned and lubricated. Concrete piers show zero micro-fissures.',
          photos: ['/uploads/sample-bridge-1.jpg'],
          report: 'Nyari_Bridge_6M_Inspection.pdf',
          submitted_at: '2026-04-10T11:00:00.000Z'
        }
      ],
      created_at: new Date('2024-11-15').toISOString()
    },
    {
      id: 'PRJ-508',
      name: 'Village Agro-Connectivity Link Corridor',
      project_type: 'road',
      govt: 'Local / Rural Body',
      department: 'Panchayat & Rural Housing Dept',
      asset_category: 'Rural Road (PMGSY)',
      type: 'road',
      start_point: 'Bedipara Village',
      end_point: 'Agricultural Market Yard APMC',
      length: 8.5,
      width: 7,
      estimated_cost: 620,
      spent_cost: 610,
      progress: 100,
      rci: 92,
      status: 'completed',
      current_step: 15,
      description: 'Paved rural asphalt link road providing round-the-year agricultural produce transit from surrounding villages directly to the regional APMC market yard.',
      team: {
        creator: 'Admin Vinit Baria (ID: ADM-901)',
        engineer: 'Er. Jaydeep Vala (ID: ENG-719)',
        surveyor: 'Rural GIS Mapping Cell (ID: GIS-882)',
        dpr: 'Gramin Infra Planners (ID: DPR-201)',
        planning: 'Panchayat Land Board (ID: PLN-109)',
        asset_mgr: 'Rural Asset Registry (ID: AST-114)',
        finance: 'PMGSY Rural Fund (ID: FIN-220)',
        procurement: 'District Panchayat Procurement (ID: PRC-409)',
        contractor: 'Maruti Road Builders (ID: CON-554)',
        qc: 'District Quality Wing (ID: QC-331)',
        accounts: 'Panchayat Accounts Cell (ID: ACC-105)'
      },
      coordinates: JSON.stringify([
        [22.3400, 70.8200],
        [22.3480, 70.8320],
        [22.3550, 70.8450]
      ]),
      created_at: new Date('2024-09-01').toISOString()
    }
  ];

  const bridges = [
    {
      id: 'BRG-101',
      project_id: 'PRJ-001',
      name: 'Aji River Main Bridge',
      type: 'psc',
      spans: 4,
      span_length: 25,
      total_length: 100,
      width: 12,
      waterbody: 'Aji River',
      cost: 1500,
      status: 'construction',
      condition_score: 75,
      created_at: new Date().toISOString()
    },
    {
      id: 'BRG-102',
      project_id: 'PRJ-002',
      name: 'Nyari Dam Overpass',
      type: 'rcc',
      spans: 2,
      span_length: 15,
      total_length: 30,
      width: 9,
      waterbody: 'Nyari River',
      cost: 450,
      status: 'tender',
      condition_score: 85,
      created_at: new Date().toISOString()
    },
    {
      id: 'BRG-103',
      project_id: 'PRJ-003',
      name: 'Aji Cable-Stayed Structure',
      type: 'steel',
      spans: 6,
      span_length: 30,
      total_length: 180,
      width: 16,
      waterbody: 'Aji River Estuary',
      cost: 2800,
      status: 'construction',
      condition_score: 82,
      created_at: new Date().toISOString()
    },
    {
      id: 'BRG-104',
      project_id: 'PRJ-205',
      name: 'Machhu River Industrial Viaduct',
      type: 'psc',
      spans: 8,
      span_length: 28,
      total_length: 224,
      width: 18,
      waterbody: 'Machhu River',
      cost: 3200,
      status: 'qc',
      condition_score: 88,
      created_at: new Date().toISOString()
    },
    {
      id: 'BRG-105',
      project_id: 'PRJ-407',
      name: 'Nyari Reservoir Spillway Bridge',
      type: 'rcc',
      spans: 3,
      span_length: 20,
      total_length: 60,
      width: 11,
      waterbody: 'Nyari Reservoir Overflow',
      cost: 950,
      status: 'completed',
      condition_score: 88,
      created_at: new Date().toISOString()
    }
  ];

  const documents = [
    {
      project_id: 'PRJ-875',
      step_key: '1',
      role: 'admin',
      doc_name: 'Initial Request & DPR Brief.pdf',
      file_path: '/uploads/sample-req.pdf',
      notes: 'Initial sanction and administrative clearance for new complex.',
      created_at: new Date('2025-01-10').toISOString()
    },
    {
      project_id: 'PRJ-875',
      step_key: '2',
      role: 'engineer',
      doc_name: 'Structural_Engineering_Assessment.pdf',
      file_path: '/uploads/sample-eng.pdf',
      notes: 'Foundation soil bearing capacity verified. Seismic Zone IV compliance affirmed.',
      created_at: new Date('2025-01-20').toISOString()
    },
    {
      project_id: 'PRJ-875',
      step_key: '9',
      role: 'procurement',
      doc_name: 'Letter_of_Acceptance_LOA.pdf',
      file_path: '/uploads/sample-loa.pdf',
      notes: 'Awarded to Shreeji Mega Structures Pvt Ltd at lowest evaluated bid.',
      created_at: new Date('2025-04-10').toISOString()
    },
    {
      project_id: 'PRJ-875',
      step_key: '13',
      role: 'qc',
      doc_name: 'Final_QC_Certificate.pdf',
      file_path: '/uploads/sample-qc.pdf',
      notes: 'Concrete core testing and non-destructive rebound tests meet standard specs.',
      created_at: new Date('2025-12-18').toISOString()
    },
    {
      project_id: 'PRJ-001',
      step_key: '1',
      role: 'admin',
      doc_name: 'NH48_Widening_Sanction_Order.pdf',
      file_path: '/uploads/nh48-sanction.pdf',
      notes: 'Cabinet approval for NH-48 6-laning project.',
      created_at: new Date('2025-03-12').toISOString()
    },
    {
      project_id: 'PRJ-001',
      step_key: '9',
      role: 'procurement',
      doc_name: 'Work_Order_Contract_Patel.pdf',
      file_path: '/uploads/patel-work-order.pdf',
      notes: 'Contract EPC signed with Patel Highway Consortium.',
      created_at: new Date('2025-06-01').toISOString()
    }
  ];

  await db.collection('projects').insertMany(projects);
  await db.collection('bridges').insertMany(bridges);
  await db.collection('documents').insertMany(documents);

  console.log(`Successfully seeded:`);
  console.log(`- ${projects.length} Projects`);
  console.log(`- ${bridges.length} Bridges`);
  console.log(`- ${documents.length} Documents`);

  await client.close();
  console.log('Done!');
}

seed().catch(err => {
  console.error('Seed Error:', err);
  process.exit(1);
});
