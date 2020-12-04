const { createLogger, transports, format } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

const logger = createLogger({
  format: combine(prettyPrint(), timestamp(), winston.format.colorize()),
  transports: [
    new transports.Console({ format: winston.format.simple() }),
    new transports.File({ filename: "logger.log" }),
    // new transports.MongoDB({
    //   db: "mongodb://localhost/vidlydb",
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify: false,
    //   useCreateIndex: true,
    // }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "rejections.log" })],
});

module.exports.winstonHandlers = function () {
  logger.exceptions.handle();
  logger.rejections.handle();
};

exports.logger = logger;
