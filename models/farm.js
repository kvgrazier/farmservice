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

function GetTransactionID(callback) {
  MongoClient.connect(url, {native_parser:true}, function(err, client) {
    assert.equal(null, err);
   const db = client.db('FarmDB');
   db.collection('transactions').find().sort({"TransactionID" : -1}).limit(1).toArray(function(err, results){
 //   console.log("TransactionID: " + results[0].TransactionID);
      callback(results[0].TransactionID+1);
     })//end collection
 client.close();
  });//end mongoclient
}

module.exports = { combine, accountsums,  accountsubtypesums, accounttypesums, GetTransactionID}