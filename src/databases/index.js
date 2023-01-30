const { config } = require("../config");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./modals/User");
const Product = require("./modals/Product");

dotenv.config();

const connect = async () => {
  const mongoUrl = `${config.mongo.url}${config.mongo.db}`;
  await mongoose
    .connect(mongoUrl)
    .then(() => console.log("MongoDb Connected!!"))
    .catch((error) => console.log(error));
};

connect();

const db = {
  user: User,
  product: Product,
};

module.exports = { connect, db };
