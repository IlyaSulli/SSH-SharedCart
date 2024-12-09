const Item = require(`${__dirname}/../models/itemModel`);
const Shop = require(`${__dirname}/../models/shopModel`);
const PersonItem = require(`${__dirname}/../models/peopleItemModel`);
const APIFeatures = require(`${__dirname}/../APIFeatures`);

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
      } else {
         req.query.searchTerm = req.query.searchTerm.replace(/-/g, ' ');
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

exports.addToCart = async (req, res) => {
   try {
      const exist = await PersonItem.find({
         PersonId: req.body.PersonId,
         ItemId: req.body.ItemId,
      });
      if (exist.length == 0) {
         const cartAdd = await PersonItem.create(req.body);
         res.status(201).json({
            status: 'success',
            data: {
               addition: cartAdd,
            },
         });
      } else {
         const newQuant = exist[0].Quantity + req.body.Quantity;
         const updateCart = await PersonItem.findByIdAndUpdate(
            exist[0].id,
            { Quantity: newQuant },
            {
               new: true,
               runValidators: true,
            }
         );
         res.status(200).json({
            status: 'success',
            data: {
               update: updateCart,
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
