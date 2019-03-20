const mongoose = require("mongoose");

const Address = new mongoose.Schema({
  street1: {type: String, required: true},
  street2: {type: String, required: false},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zipCode: {type: String, required: true},
  country: {type: String, required: true}
});

const CreditCard = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  last4Numbers: {type: Number, required: true},
  creditCardAPIToken: {type: String, required: true},
  isDefault: {type: Boolean, required: true}
});

const StudentSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  billingAddress: {type: Address},
  creditCards: [CreditCard]
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = {
  Address,
  CreditCard,
  Student
};
