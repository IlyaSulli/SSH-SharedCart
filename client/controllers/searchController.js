const Item = require('./../models/itemModel');
const Shop = require('./../models/shopModel');
const APIFeatures = require('./../APIFeatures');
const { QueryCursor } = require('mongoose');
const { threadId } = require('worker_threads');
const { start } = require('repl');

exports.getShops = async (req, res) => {
   try {
      const shops = await Shop.find();

      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
         results: shops.length,
         data: {
            shops,
         },
      });
   } catch (err) {
      console.log(err);
      res.status(404).json({
         status: 'fail',
         message: err,
      });
   }
};

exports.getShopItems = async (req, res) => {
   try {
      if (!req.query.searchTerm) {
         req.query.searchTerm = '';
      }

      const itemQuery = Item.find({
         ShopID: req.params.shopid,
         ItemName: { $regex: req.query.searchTerm, $options: 'i' },
      });

      const features = new APIFeatures(itemQuery, req.query).sort().paginate();

      const items = await features.query;

      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
         results: items.length,
         data: {
            items,
         },
      });
   } catch (err) {
      console.log(err);
      res.status(404).json({
         status: 'fail',
         message: err,
      });
   }
};

exports.getItem = async (req, res) => {
   try {
      const item = await Item.findById(req.params.id);
      res.status(200).json({
         status: 'success',
         data: {
            item,
         },
      });
   } catch (err) {
      console.log(err);
      res.status(404).json({
         status: 'fail',
         message: err,
      });
   }
};
