const express = require('express');
const cartController = require('./../controllers/cartController');

const router = express.Router();

router.route('/').get(cartController.getInfo);

module.exports = router;
