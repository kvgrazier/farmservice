//'use strict';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/';

function accounttypesums(client, callback) {
  client.connect(url, { useNewUrlParser: true },function(err, client) {
    assert.equal(null, err);
    console.log("AccountTypeSums " + Date.now());
    const db = client.db('FarmDB');
    db.collection('accounttypesums').find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });//end collection
 client.close();
  });//end mongoclient
}//end function

function accountsubtypesums(client, callback) {
  client.connect(url, { useNewUrlParser: true },function(err, client) {
    assert.equal(null, err);
    console.log("AccountSubTypeSums" + Date.now());
    const db = client.db('FarmDB');
    db.collection('accountsubtypesums').find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });//end collection
 client.close();
  });//end mongoclient
}//end function

function accountsums(client, callback) {
  client.connect(url, { useNewUrlParser: true },function(err, client) {
    assert.equal(null, err);
    console.log("AccountSums" + Date.now());
    const db = client.db('FarmDB');
    db.collection('accountsums').find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });//end collection
 client.close();
  });//end mongoclient
}//end function

function combine(callback) {
  let ATS = accounttypesums(MongoClient, function(ats) {
   let ASTS = accountsubtypesums(MongoClient, function(asts) {
    let AS = accountsums(MongoClient, function(as) {
    var output = ats.concat(asts.concat(as));
    callback(output);
        });//end function
      });//end function
     });//end function
}
module.exports = { combine, accountsums,  accountsubtypesums, accounttypesums}