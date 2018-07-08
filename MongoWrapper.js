const MongoClient = require('mongodb').MongoClient;

module.exports = class MongoWrapper {
  constructor(url, dbName, collectionName) {
    this.url = 'mongodb://localhost:27017';
    this.dbName = 'saradhiDB';
    this.collectionName = 'insights';
    this.db = null;
    this.collection = null;
    this.client = null;
  }

  connect() {
    MongoClient.connect(
      this.url,
      (err, client) => {
        console.log('Connected successfully to server');

        const db = client.db(this.dbName);
        this.db = db;
        this.client = client;
        this.collection = db.collection(this.collectionName);
      }
    );
  }

  insert(data, callback) {
    // Get the documents collection
    // Insert some documents
    this.collection.insertOne(data, function(err, result) {
      console.log('inserted 1 document');
      if (typeof callback === Function) callback(result);
    });
  }

  getAll(callback) {
    this.collection.find({}).toArray(function(err, docs) {
      console.log('Found the following records');
      callback(docs);
    });
  }

  close() {
    this.client.close();
  }
};
