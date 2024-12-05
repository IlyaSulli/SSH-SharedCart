const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.route('/').get(searchController.getShops);

router.route('/:shopid').get(searchController.getShopItems);

module.exports = router;
