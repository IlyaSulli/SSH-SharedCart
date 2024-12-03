const mongoose = require('mongoose');

const peopleItemSchema = new mongoose.Schema({
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

const PersonItem = mongoose.model('peopleItems', peopleItemSchema);

module.exports = PersonItem;
