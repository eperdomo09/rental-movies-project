const config = require("config");
const mongoose = require("mongoose");
const { logger } = require("../startup/logging");

module.exports = async function () {
  const db = config.get("db");
  await mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  logger.info(`Connected to MongoDB...`);
};
