const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb://walayat37:Meesum30@expensetracker-shard-00-00.ijusz.mongodb.net:27017,expensetracker-shard-00-01.ijusz.mongodb.net:27017,expensetracker-shard-00-02.ijusz.mongodb.net:27017/sample_airbnb?ssl=true&replicaSet=atlas-lzdbm4-shard-0&authSource=admin&retryWrites=true&w=majority";


const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");

    } catch (err) {
        console.log(err.stack);
        const inspect = require('util').inspect
        console.log(inspect(err, { depth: Infinity, showHidden: true }));
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);