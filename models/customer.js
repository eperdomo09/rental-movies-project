const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const customerSchema = new Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  phone: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 10,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

//using joi for validation
function joiValidate(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(5).max(20).required(),

    phone: Joi.string().required().min(7).max(10),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = joiValidate;
