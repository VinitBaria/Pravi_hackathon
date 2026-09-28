const { MongoClient } = require('mongodb'); 
async function run() { 
  const client = new MongoClient('mongodb://localhost:27017'); 
  await client.connect(); 
  const db = client.db('roadworks'); 
  await db.collection('projects').updateOne({ id: 'PRJ-875' }, { $set: { current_step: 13 } }); 
  console.log('Fast-forwarded PRJ-875 to Billing stage (index 13)'); 
  await client.close(); 
} 
run();
