const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { string } = require("joi");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 155,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().min(5).max(155).required().email(),
    password: Joi.string().min(5).max(155).required(),
  });
  return schema.validate(user);
}

function validateReq(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(155).required().email(),
    password: Joi.string().min(5).max(155).required(),
  });
  return schema.validate(req);
}

exports.validate = validateUser;
exports.validateReq = validateReq;
exports.User = User;
