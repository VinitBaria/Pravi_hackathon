import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://vinitbaria2006_db_user:pwCA97wnGwoueZbj@cluster1.2f2vsux.mongodb.net/roadworks?retryWrites=true&w=majority&appName=Cluster1';
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  const db = client.db('roadworks');
  
  // Seed initial data if empty
  const projectCount = await db.collection('projects').countDocuments();
  if (projectCount === 0) {
    await seedMongo(db);
  }
  
  return db;
}

async function seedMongo(db) {
  const projects = [
    {
      id: 'PRJ-001',
      name: 'NH-48 Widening',
      description: 'Widening of NH-48 from 4 lanes to 6 lanes to reduce traffic congestion.',
      status: 'construction',
      classification: 'national',
      length: 45.5,
      width: 24,
      estimated_cost: 12500,
      spent_cost: 4500,
      progress: 35,
      rci: 65,
      coordinates: JSON.stringify([
        [22.3039, 70.8022], [22.3150, 70.8100], [22.3300, 70.8250], [22.3500, 70.8400]
      ]),
      created_at: new Date().toISOString()
    },
    {
      id: 'PRJ-002',
      name: 'Rajkot Ring Road Phase 2',
      description: 'Development of the second phase of the outer ring road for Rajkot.',
      status: 'approval',
      classification: 'state',
      length: 12.0,
      width: 18,
      estimated_cost: 4200,
      spent_cost: 150,
      progress: 5,
      rci: 40,
      coordinates: JSON.stringify([
        [22.2800, 70.7800], [22.2700, 70.7900], [22.2600, 70.8100]
      ]),
      created_at: new Date().toISOString()
    },
    {
      id: 'PRJ-003',
      name: 'Village Link Road Repair',
      description: 'Pothole repair and resurfacing of the main village link road.',
      status: 'completed',
      classification: 'urban',
      length: 5.2,
      width: 7,
      estimated_cost: 850,
      spent_cost: 800,
      progress: 100,
      rci: 90,
      coordinates: JSON.stringify([
        [22.3200, 70.7500], [22.3300, 70.7600]
      ]),
      created_at: new Date().toISOString()
    }
  ];

  const bridges = [
    {
      id: 'BRG-101',
      project_id: 'PRJ-001',
      name: 'Aji River Bridge',
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
    }
  ];

  await db.collection('projects').insertMany(projects);
  await db.collection('bridges').insertMany(bridges);
  console.log('MongoDB Seeded Successfully.');
}
