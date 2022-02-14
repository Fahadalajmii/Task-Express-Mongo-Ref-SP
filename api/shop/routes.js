const express = require("express");
const passport = require("passport");
const router = express.Router();
const { getShop, shopCreate, productCreate } = require("./controllers");

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
