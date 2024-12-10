const express = require('express');
const apiController = require(`${__dirname}/../controllers/apiController`);

const router = express.Router();

router.route('/').get(apiController.getInfo);

module.exports = router;