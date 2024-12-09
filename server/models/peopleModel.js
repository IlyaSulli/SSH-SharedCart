const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
   FirstName: {
      type: String,
      required: true,
   },
   LastName: {
      type: String,
      required: true,
   },
   Confirmed: {
      type: Boolean,
      required: true,
   },
   Cart: {
      type: String,
   },
});

const Person = mongoose.model('Person', peopleSchema);

module.exports = Person;
