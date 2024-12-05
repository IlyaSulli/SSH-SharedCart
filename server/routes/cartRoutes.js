const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.route('/').get(cartController.getInfo);

router.route('/updateQuantity/:personid/:itemid/:quantity').get(cartController.updateQuantity);

router.route('/deleteItem/:personid/:itemid').get(cartController.deleteItem);

router.route('/updateStatus/:personid').get(cartController.updateStatus);

router.route('/getShops').get(cartController.getShops);

module.exports = router;
