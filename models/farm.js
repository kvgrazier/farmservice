var express = require('express');
var mongoose = require('mongoose');
var Ta = require('../models/Ta.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/';

function pltotal(person,fromDate,toDate,callback) {
  var fromDate = new Date(fromDate.toISOString());
  var toDate = new Date(toDate.toISOString());
        Ta.aggregate([
          {$match: { 
            Person: person
             ,TransactionDate: {$gte: fromDate}
             ,TransactionDate: {$lte: toDate}
          }}
          ,{$group:
            {
              _id: { AccountType: "$AccountType", AccountSubType: "Total", SortOrder: "100"
              , AccountNumber: "", AccountName: "",Person: "$Person" },
              Amount: { $sum: "$AccountAmount" }
          }}
          ,{$project: {
            _id: 0,
                AccountType: "$_id.AccountType",
                AccountSubType: "$_id.AccountSubType",
                AccountNumber: "$_id.AccountNumber",
                AccountName: "$_id.AccountName",
                Amount: {$cond: [ { $eq: [ "$_id.AccountType", "Revenue" ] }, "$Amount", 
                { $multiply: [ "$Amount", -1 ] }]},  
                Person: "$_id.Person",
                SortOrder: {$cond: [ { $eq: [ "$_id.AccountType", "Revenue" ] }, 13.7, 50 ]}  
            }}
          ,{$group:
            {
              _id: { AccountType: "Total Profit or Loss", AccountSubType: "", SortOrder: "100"
              , AccountNumber: "", AccountName: "",Person: "$Person" },
              Amount: { $sum: "$Amount" }
          }}
          ,{$project: {
            _id: 0,
                AccountType: "$_id.AccountType",
                AccountSubType: "$_id.AccountSubType",
                AccountNumber: "$_id.AccountNumber",
                AccountName: "$_id.AccountName",
                Amount: "$Amount",  
                Person: "$_id.Person",
                SortOrder: "$_id.SortOrder"  
            }}
        ])//end Aggregate
        .exec(function(err, results){
          callback(results);
         })
}//end function

function accounttypesums(person,fromDate,toDate,callback) {
    var fromDate = new Date(fromDate.toISOString());
    var toDate = new Date(toDate.toISOString());
          Ta.aggregate([
            {$match: { 
              Person: person
               ,TransactionDate: {$gte: fromDate}
               ,TransactionDate: {$lte: toDate}
            }}
            ,{$group:
              {
                _id: { AccountType: "$AccountType", AccountSubType: "Total", SortOrder: "100"
                , AccountNumber: "", AccountName: "",Person: "$Person" },
                Amount: { $sum: "$AccountAmount" }
            }}
            ,{$project: {
              _id: 0,
                  AccountType: "$_id.AccountType",
                  AccountSubType: "$_id.AccountSubType",
                  AccountNumber: "$_id.AccountNumber",
                  AccountName: "$_id.AccountName",
                  Amount: "$Amount",
                  Person: "$_id.Person",
                  SortOrder: {$cond: [ { $eq: [ "$_id.AccountType", "Revenue" ] }, 13.7, 50 ]}  
              }}
          ])//end Aggregate
          .exec(function(err, results){
            callback(results);
           })
  }//end function

function accountsubtypesums(person,fromDate,toDate,callback) {
    var fromDate = new Date(fromDate.toISOString());
    var toDate = new Date(toDate.toISOString());
          Ta.aggregate([
            {$match: { 
              Person: person
               ,TransactionDate: {$gte: fromDate}
               ,TransactionDate: {$lte: toDate}
            }}
            ,{$group:
              {
                _id: { AccountType: "$AccountType", AccountSubType: "$AccountSubType", SortOrder: "$SortOrder"
                , AccountNumber: "Total", AccountName: "",Person: "$Person" },
                Amount: { $sum: "$AccountAmount" }
            }}              
            ,{$project: {
              _id: 0,
                  AccountType: "$_id.AccountType",
                  AccountSubType: "$_id.AccountSubType",
                  AccountNumber: "$_id.AccountNumber",
                  AccountName: "$_id.AccountName",
                  Amount: "$Amount",
                  Person: "$_id.Person",  
                  SortOrder: { $add: [ "$_id.SortOrder", .1 ] }
              }}
          ])//end Aggregate
          .exec(function(err, results){
            callback(results);
           })
  }//end function

function accountsums(person,fromDate,toDate,callback) {
  var fromDate = new Date(fromDate.toISOString());
  var toDate = new Date(toDate.toISOString());
        Ta.aggregate([
          {$match: { 
            Person: person
             ,TransactionDate: {$gte: fromDate}
             ,TransactionDate: {$lte: toDate}
          }}
          ,{$group:
              {
                _id: { AccountType: "$AccountType", AccountSubType: "$AccountSubType", SortOrder: "$SortOrder"
                , AccountNumber: "$AccountNumber", AccountName: "$AccountName", Person: "$Person" },
                Amount: { $sum: "$AccountAmount" }
              }}
              ,{$project: {
                _id: 0,
                    AccountType: "$_id.AccountType",
                    AccountSubType: "$_id.AccountSubType",
                    AccountNumber: "$_id.AccountNumber",
                    AccountName: "$_id.AccountName",
                    Amount: "$Amount",
                    Person: "$_id.Person",  
                    SortOrder: "$_id.SortOrder"
                }}
        ])//end Aggregate
        .exec(function(err, results){
          callback(results);
         })
}//end function

function combine(person,fromDate,toDate,callback) {
  let PLTot = pltotal(person,fromDate,toDate, function(pltot) {
   let ATS = accounttypesums(person,fromDate,toDate, function(ats) {
    let ASTS = accountsubtypesums(person,fromDate,toDate, function(asts) {
     let AS = accountsums(person,fromDate,toDate, function(as) {
     var output = pltot.concat(ats.concat(asts.concat(as)));
     callback(output.sort((a, b) => a.SortOrder - b.SortOrder));
        });//end function
      });//end function
     });//end function
    });//end function
}

function GetTransactionID(callback) {
  MongoClient.connect(url, {native_parser:true}, function(err, client) {
    assert.equal(null, err);
   const db = client.db('FarmDB');
   db.collection('transactions').find().sort({"TransactionID" : -1}).limit(1).toArray(function(err, results){
      callback(results[0].TransactionID+1);
     })//end collection
 client.close();
  });//end mongoclient

}

module.exports = { combine, accountsums,  accountsubtypesums, accounttypesums, GetTransactionID}