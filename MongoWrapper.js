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

  get(data, callback) {
    const query = {};
    if (data.vertical) {
      query.vertical = data.vertical;
    }
    if (data.analyst) {
      query.analyst = data.analyst;
    }
    if (data.advertiser) {
      query.advertiser = data.advertiser;
    }
    if (data.market) {
      query.market = data.market;
    }
    if (data.primaryTags) {
      query.primaryTags = { $all: data.primaryTags };
    }
    if (data.secondaryTags) {
      query.secondaryTags = { $all: data.secondaryTags };
    }
    if (data.filename) {
      query['file.fileName.name'] = { $regex: data.filename, $options: 'i' };
      // query['file.fileName.name'] = data.filename;
    }

    this.collection.find(query).toArray(function(err, docs) {
      console.log('Found the following records');
      callback(docs);
    });
  }

  close() {
    this.client.close();
  }
};
