const Item = require('../models/itemModel');
const Shop = require('../models/shopModel');
const Person = require('../models/peopleModel');
const PersonItem = require('../models/peopleItemModel');
const APIFeatures = require('../APIFeatures');

exports.getInfo = async (req, res) => {
   try {
      const people = await Person.find();

      for (const person of people) {
         let id = person._id.toString();
         let items = await PersonItem.find({
            PersonId: id,
         });
         var cart = [];
         for (const item of items) {
            let itemid = item.ItemId.toString();
            const itemObj = await Item.findById(itemid);
            cart.push(itemObj);
         }
         person.Cart = cart.toString();
      }

      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
         data: {
            people,
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

exports.updateQuantity = async (req,res) => {
   try {
      const itemQuery = PersonItem.find({
         ItemId: req.params.itemid,
         PersonId: req.params.personid,
      });

      const updateDocument = {
         $set: {
            Quantity: req.params.quantity,
         },
      };

      const item = await PersonItem.updateOne(itemQuery, updateDocument);

      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
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

exports.deleteItem = async (req,res) => {
try {
   const itemQuery = PersonItem.findOne({
      PersonId: req.params.personid,
      ItemId: req.params.itemid,
   });

   const item = await PersonItem.deleteOne(itemQuery);

   res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
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

exports.updateStatus = async (req,res) => {
   try {
      var personQuery = await Person.findById(req.params.personid);
      var person;
      console.log(personQuery.Confirmed);
      if (personQuery.Confirmed == true) {
         const updateDocument = {
            $set: {
               Confirmed: false, // If True -> False
            },
         };
         person = await Person.updateOne(personQuery, updateDocument);
      } else {
         const updateDocument = {
            $set: {
               Confirmed: true, // If False -> True
            },
         };
         person = await Person.updateOne(personQuery, updateDocument);
      }
      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
         data: {
            person,
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

exports.getShops = async (req,res) => {
   try {
      const shops = await Shop.find();
      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
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
