var mongoose = require('mongoose');

var AccountPersonSchema = new mongoose.Schema({
  AccountPersonName: String
});

var AccountTypeSchema = new mongoose.Schema({
  AccountTypeName: String
});

var AccountSubTypeSchema = new mongoose.Schema({
  AccountSubTypeName: String,
  SortOrder : Number,
  AccountType: AccountTypeSchema, AccountType: AccountTypeSchema 
});

var AccountSchema = new mongoose.Schema({
    AccountNumber : Number,
    AccountName: String,
    TaxFormRef: String,
    Active : Boolean,
    AccountPerson : AccountPersonSchema, AccountPerson: AccountPersonSchema, 
    AccountSubType : AccountSubTypeSchema, AccountSubType: AccountSubTypeSchema 
  });

  module.exports = mongoose.model('Account', AccountSchema);


