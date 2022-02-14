const Product = require("../../models/Product");
const Shop = require("../../models/Shop");

exports.fetchShop = async (shopId, next) => {
  try {
    const shop = await Shop.findById(shopId);

    if (shop) return shop;
    else {
      const error = new Error("Shop ID was not found!");
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.getShop = async (req, res) => {
  try {
    const shops = await Shop.find().populate("products");
    return res.json(shops);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.shopCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/${req.file.path}`;
      req.body.image = req.body.image.replace("\\", "/");
    }
    req.body.owner = req.user._id;
    const newShop = await Shop.create(req.body);
    return res.status(201).json(newShop);
  } catch (error) {
    next(error);
  }
};

exports.productCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/${req.file.path}`;
      req.body.image = req.body.image.replace("\\", "/");
    }

    if (req.user.id === req.shop.owner) {
      const { shopId } = req.params;
      req.body.shop = shopId;
      const newProduct = await Product.create(req.body);
      await Shop.findByIdAndUpdate(shopId, {
        $push: { products: newProduct._id },
      });
      return res.status(201).json(newProduct);
    } else {
      const error = new Error("you are not the owner of this shop");
      error.status = 401;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
