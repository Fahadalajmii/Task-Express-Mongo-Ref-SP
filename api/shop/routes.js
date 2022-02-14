const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  getShop,
  shopCreate,
  productCreate,
  fetchShop,
} = require("./controllers");

router.param("shopId", async (req, res, next, shopId) => {
  const shop = await fetchShop(shopId, next);
  if (shop) {
    req.shop = shop;
    next();
  } else {
    const err = new Error("Product Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", getShop);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),

  shopCreate
);
router.post(
  "/shops/:shopId/products",
  passport.authenticate("jwt", { session: false }),
  productCreate
);

module.exports = router;
