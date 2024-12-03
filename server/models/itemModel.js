const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
   ItemName: {
      type: String,
      required: true,
   },
   ItemCost: {
      type: Number,
      required: true,
   },
   ImageLink: {
      type: String,
      required: true,
   },
   ShopID: {
      type: String,
      required: true,
   },
   ItemDescription: {
      type: String,
      required: true,
   },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
