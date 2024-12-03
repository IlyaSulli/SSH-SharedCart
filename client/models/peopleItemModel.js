const mongoose = require('mongoose');

const itemPeopleSchema = new mongoose.Schema({
   PersonId: {
      type: String,
      required: true,
   },
   ItemId: {
      type: String,
      required: true,
   },
   Quantity: {
      type: Number,
      required: true,
   },
});

const ItemPerson = mongoose.model('ItemPerson', itemPeopleSchema);

module.exports = ItemPerson;
