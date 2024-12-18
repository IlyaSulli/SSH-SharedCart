const express = require('express');
const searchController = require(`${__dirname}/../controllers/searchController`);

const router = express.Router();

router.route('/').get(searchController.getShops);

router
   .route('/:shopid')
   .get(searchController.getShopItems)
   .post(searchController.addToCart);

module.exports = router;
