const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  firstname:  {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  employee:  {
    type: Boolean,
    default: false,
  }
});

const Account = mongoose.model('Accounts', accountSchema);

module.exports = Account;