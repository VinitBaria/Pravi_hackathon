import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('roadworks');
    await db.collection('projects').insertOne({
      id: 'PRJ-TEST-CONTRACTOR',
      name: 'Tender Assignment Test',
      description: 'Testing contractor assignment',
      current_step: 11, // Index 11 -> Step key 12 'Contract Award'
      status: 'pending',
      length: 5,
      rci: 60,
      estimated_cost: 100,
      created_at: new Date().toISOString()
    });
    console.log('Project inserted');
  } finally {
    await client.close();
  }
}
run();
