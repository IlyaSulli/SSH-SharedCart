const Item = require(`${__dirname}/../models/itemModel`);
const Shop = require(`${__dirname}/../models/shopModel`);
const Person = require(`${__dirname}/../models/peopleModel`);
const PersonItem = require(`${__dirname}/../models/peopleItemModel`);
const APIFeatures = require(`${__dirname}/../APIFeatures`);

exports.getInfo = async (req, res) => {
   try {
      const people = await Person.find();
      for (var i = 0; i < people.length; i++) {
         let id = people[i]._id.toString();
         let items = await PersonItem.find({
            PersonId: id,
         });
         var cart = [];
         for (const item of items) {
            let itemid = item.ItemId.toString();
            const itemObj = await Item.findById(itemid);
            const quantityItem = await PersonItem.findOne({
               PersonId: id,
               ItemId: itemid,
            });
            const updatedItem = {
               ...itemObj.toObject(),
               _id: itemid,
               Quantity: quantityItem.Quantity,
            };
            cart.push(updatedItem);
         }
         if (cart.length > 0) {
         let jsonString = JSON.stringify(cart, null, 0);
         people[i].Cart = jsonString;
         } else {
            people.splice(i, 1);
            i--;
         }
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

exports.updateQuantity = async (req, res) => {
   try {
      const itemQuery = PersonItem.find({
         ItemId: req.query.itemId,
         PersonId: req.query.userId,
      });

      const updateDocument = {
         $set: {
            Quantity: req.query.quantity,
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

exports.deleteItem = async (req, res) => {
   try {
      const itemQuery = PersonItem.findOne({
         PersonId: req.query.userId,
         ItemId: req.query.itemId,
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

exports.updateStatus = async (req, res) => {
   try {
      var personQuery = await Person.findById(req.query.userId);
      var person;
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
      const people = await Person.find();
      var confirmedPeople = [];
      var allPeople = [];
      for (onePerson of people) {
         if (PersonItem.find({PersonId: onePerson._id.toString()}).length != 0) {
            allPeople.push(onePerson._id);
            const length = await Person.find({_id: onePerson._id, Confirmed: true}).length;
            if (length != 0) {
               confirmedPeople.push(onePerson);
            }
         }
      }
      if (confirmedPeople.length == allPeople.length) {
         await Person.updateMany({}, {$set: {Confirmed: false}});
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

exports.getShops = async (req, res) => {
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

exports.getSelectedShop = async (req, res) => {
   try {
      const items = await PersonItem.find();
      if (items.length != 0) {
         const itemId = items[0].ItemId;
         const shopId = await Item.findById(itemId);
         const shop = await Shop.findById(shopId.ShopID);
         res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            data: {
               shop,
            },
         });
      } else {
         res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            data: {
            },
         });
      }
   } catch (err) {
      console.log(err);
      res.status(404).json({
         status: 'fail',
         message: err,
      });
   }
};

exports.getUsers = async (req, res) => {
   try {
      const people = await Person.find();
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

exports.getCartCount = async (req, res) => {
   try {
      const personitems = await PersonItem.find({
         PersonId: req.query.userId,
      });
      var cart = [];
      for (item of personitems) {
         const chosenItem = await Item.findById(item.ItemId);
         cart.push(chosenItem);
      }
      res.status(200).json({
         status: 'success',
         requestedAt: req.requestTime,
         data: {
            cart,
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
