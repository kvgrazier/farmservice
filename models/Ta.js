var mongoose = require('mongoose');

var TaSchema = new mongoose.Schema({

    TransactionID: Number,
    TransactionDate: Date,
    TransactionDescription: String,
    AccountNumber: Number,
    AccountAmount: Number,
    AccountName: String,
    AccountSubType: String,
    SortOrder: Number,
    AccountType: String,
    Person: String
  });

  module.exports = mongoose.model('Ta', TaSchema);