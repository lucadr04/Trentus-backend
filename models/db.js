const mongoose = require('mongoose');

// Carico la stringa di connessione
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Creo un mongoose client
async function run() {
  try {
    await mongoose.connect(mongoURI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch(error){
    console.log("Error while connecting to db: " + error);
  }
}

run().catch(console.dir);
// mongoose.set('debug', true);
let db = mongoose.connection;

module.exports = db; 