const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
  if (process.env.NODE_ENV === "development") app.use(cors());
};
