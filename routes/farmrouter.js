var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');
var Account = require('../models/Account.js');
var Ta = require('../models/Ta.js');
let farm = require('../models/farm.js');

/* Profit And Loss */
router.get('/pl/', function(req, res) {
  var fromDate = new Date(req.query.fromdate);
  var toDate = new Date(req.query.todate);
  let Sums = farm.combine(req.query.person,fromDate,toDate,function(docs) {
    res.json(docs); });//end function
});// end router

/* Transactions with Accounts */
router.get('/ta/', function(req, res) {
  var fromDate = new Date(req.query.fromdate);
  var toDate = new Date(req.query.todate);
  Ta.aggregate([
    {$match: { 
      Person: req.query.person
       ,TransactionDate: {$gte: fromDate}
       ,TransactionDate: {$lte: toDate}
    }}
  ,{$sort: { TransactionID: 1 }}
]).exec(function(err, results){
  res.json(results);
 })
});

/* Account List */
router.get('/accountlist/', function(req, res) {
  Account.aggregate([
    {$match: {
          Active: true
      }},
    {$project: {
        _id: 0,
        AccountNumber: "$AccountNumber"
        ,AccountDescription: { $concat: [ {$substr:["$AccountNumber", 0, -1 ]}, " - ", "$AccountName" ] }
    }},
  {$sort: { AccountNumber: 1 }}
 ]).exec(function(err, results){
  res.json(results);
 })
});

/* AccountPersonList */
router.get('/accountpersonlist/', function(req, res) {
  res.json(  
  [{value: 'Allen', viewValue: 'Allen'},
  {value: 'Mark', viewValue: 'Mark'},
  {value: 'Mike', viewValue: 'Mike'}]
  ); 
 // ["Allen", "Mark", "Mike"]
});

/* AccountTypeList */
router.get('/accounttypelist/', function(req, res) {
  res.json(
    [{value: 'Expenses', viewValue: 'Expenses'},
    {value: 'Revenue', viewValue: 'Revenue'}]
//    ["Expenses", "Revenue"]
    );
});

/* GET ALL TransactionS */
router.get('/transaction/', function(req, res, next) {
  Transaction.find(function (err, products) {    
    if (err) return next(err);
    console.log("trans requested " + Date.now());
    res.json(products);
  }).sort( { TransactionID: 1 } );
});

/* GET SINGLE Transaction BY ID */
router.get('/transaction/:id', function(req, res, next) {
  Transaction.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Transaction */
router.post('/transaction/', function(req, res, next) {
  let maxTID = farm.GetTransactionID(function(max) {
   // console.log('Req before is: ' + req.body.TransactionID);
    req.body.TransactionID = max; 
   // console.log('Req after is: ' + req.body.TransactionID);
    Transaction.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });//end function
});

/* UPDATE Transaction */
router.put('/transaction/:id', function(req, res, next) {
  Transaction.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Transaction */
router.delete('/transaction/:id', function(req, res, next) {
  Transaction.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET ALL Accounts */
router.get('/account/', function(req, res, next) {
  Account.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort( { AccountNumber: 1 } );
});

/* GET SINGLE Account BY ID */
router.get('/account/:id', function(req, res, next) {
  Account.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Account */
router.post('/account/', function(req, res, next) {
  Account.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Account */
router.put('/account/:id', function(req, res, next) {
  Account.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Account */
router.delete('/account/:id', function(req, res, next) {
  Account.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;