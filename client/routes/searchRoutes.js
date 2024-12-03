const express = require('express');
const searchController = require('./../controllers/searchController');

const router = express.Router();

router.route('/items').get(searchController.getItems);

module.exports = router;
