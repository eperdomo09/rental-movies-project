const { User, validateReq } = require("../models/users");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateReq(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
