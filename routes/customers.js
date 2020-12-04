const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//get all the customer
router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

//get customer by ID
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with the given id was not found");
  res.send(customer);
});

//Inserting a new customer
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});

//Updating customer by ID
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
      },
    },
    { new: true }
  );

  if (!customer)
    return res.status(404).send("Customer with the given id was not found");
  res.send(customer);
});

//Removing customer by ID
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      res.status(404).send("Customer with the given id was not found");

    res.send(customer);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
