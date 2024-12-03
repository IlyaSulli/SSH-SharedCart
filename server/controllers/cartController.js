const Item = require('./../models/itemModel');
const Shop = require('./../models/shopModel');
const Person = require('./../models/peopleModel');
const PersonItem = require('./../models/peopleItemModel');
const APIFeatures = require('./../APIFeatures');

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
