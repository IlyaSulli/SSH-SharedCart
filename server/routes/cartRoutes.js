const express = require('express');
const cartController = require('./../controllers/cartController');

const router = express.Router();

router.route('/').get(cartController.getInfo);

router
   .route('/updateQuantity/')
   .get(cartController.updateQuantity);

router.route('/deleteItem/').get(cartController.deleteItem);

router.route('/updateStatus/').get(cartController.updateStatus);

router.route('/getShops/').get(cartController.getShops);

router.route('/getSelectedShop/').get(cartController.getSelectedShop);

router.route('/getUsers/').get(cartController.getUsers);

router.route('/getCartCount/').get(cartController.getCartCount);

module.exports = router;
