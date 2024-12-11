const mongoose = require('mongoose');

const APISchema = new mongoose.Schema({
    APIRequest: {
       type: Object,
       required: true,
    },
    APITimeRequest: {
      type: String,
      required: true,
    }
 }, {
   versionKey: false
 });

const APIs = mongoose.model('API', APISchema);
module.exports = APIs;