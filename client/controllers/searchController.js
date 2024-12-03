const Item = require('./../models/itemModel');
const { QueryCursor } = require('mongoose');
const { threadId } = require('worker_threads');
const { start } = require('repl');

exports.getItems = async (req, res) => {
   try {
      const items = await Item.find();

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
