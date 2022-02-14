const express = require("express");
const cors = require("cors");
const connectDb = require("./database");
const productsRoutes = require("./api/products/routes");
const shopRoutes = require("./api/shop/routes");
const userRoutes = require("./api/users/routes");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
});

// Routes
app.use("/products", productsRoutes);
app.use("/", shopRoutes);
app.use("/user", userRoutes);
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
app.listen(process.env.PORT || 5000, () => {
  connectDb();
});
