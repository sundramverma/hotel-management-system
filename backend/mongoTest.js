const { MongoClient } = require('mongodb');

// Non-SRV connection (direct IP)
const uri = 'mongodb://sundramverma:lala0562@cluster0-shard-00-00.nza7dpe.mongodb.net:27017/hotel-management?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=sundram';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected with Non-SRV string!');
    process.exit(0);
  } catch (err) {
    console.log('❌ Error:', err.message);
    process.exit(1);
  }
}

run();