const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
   shopName: {
      type: String,
      required: true,
   },
   DeliveryPrice: {
      type: Number,
      required: true,
   },
   DeliveryLogo: {
      type: String,
      required: true,
   },
   Colour: {
      type: String,
      required: true,
   },
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
