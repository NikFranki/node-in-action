// 由于不知道本书的 mongodb 版本，导致后续出错（不纠结解决了），所有后面改用 mongodb@3.7.3 实现
// var mongodb = require('mongodb');
// // 连接 mongodb (host: 127.0.0.1 port: 27017)
// var server = new mongodb.Server('127.0.0.1', 27017, {});

// var client = new mongodb.Db('mydatabase', server, { w: 1 });

// 访问 mongodb 集合

// client.open(function(err) {
//   if (err) throw err;
//   client.collection('test_insert', function(err, collection) {
//     if (err) throw err;
//     console.log('We are now able to perform queries.');

//     // 将文档插入到集合中
//     collection.insert(
//       {
//         title: 'I like cake',
//         body: 'It is quite good.',
//       },
//       { safe: true },
//       function(err, documents) {
//         if (err) throw err;
//         console.log('Document ID is: ' + documents[0].__id);
//       }
//     );

//     // 更新文档数据
//     var __id = new client.bson_serializer.ObjectID('4e65d344ac74b5a01000001');

//     collection.update(
//       { __id: __id },
//       { $set: { title: 'I ate too much cake' } },
//       { safe: true },
//       function(err) {
//         if (err) throw err;
//       }
//     );

//     // 查询文档的数据
//     collection.find({ title: 'I like cake' }).toArray(function(err, results) {
//       if (err) throw err;
//       console.log(results);
//     });

//     // 删除文档
//     var __id = new client.bson_serializer.ObjectID('4e6513f0730d319501000001');
//     collection.remove({ __id: __id }, { safe: true }, function() {
//       if (err) throw err;
//     });
//   });
// });

// 预先工作
// 安装好 mongodb 服务器并启动
// 安装好 mongodb 可视化工具

// 新版实现 mongodb@3.7.3

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Connect to MongoDB
// Database Name
const dbName = 'mydatabase';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  // insertDocuments(db, function() {
  //   findDocuments(db, function() {
  //     updateDocument(db, function() {
  //       removeDocument(db, function() {
  //         client.close();
  //       });
  //     });
  //   });
  // });

  insertDocuments(db, function() {
    indexCollection(db, function() {
      client.close();
    });
  });
});

// Insert a Document
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('test_insert');
  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('Inserted 3 documents into the collection');
    callback(result);
  });
};

// Find All Documents
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('test_insert');
  // Find some documents
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    console.log('Found the following records');
    console.log(docs);
    callback(docs);
  });
};

// Update a document
const updateDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('test_insert');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Updated the document with the field a equal to 2');
    callback(result);
  });
};

// Remove a document
const removeDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('test_insert');
  // Delete document where a is 3
  collection.deleteOne({ a: 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Removed the document with the field a equal to 3');
    callback(result);
  });
};

// Index a Collection
const indexCollection = function(db, callback) {
  db.collection('documents').createIndex({ a: 1 }, null, function(err, results) {
    console.log(results);
    callback();
  });
};