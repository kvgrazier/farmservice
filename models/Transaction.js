var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({

    TransactionID: Number,
    TransactionDate: Date,
    TransactionDescription: String,
    AccountNumber: Number,
    AccountAmount: Number
  });

  module.exports = mongoose.model('Transaction', TransactionSchema);