// loginRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../Schema/UserSchema'); // Import your User model here
const bcryptjs = require('bcryptjs');

router.post('/loginn', async (req, res) => {
  try {
    let val = await User.findOne({ email: req.body.email });
    if (!val) {
      return res.status(404).send("User not found");
    }

    let e = await bcryptjs.compare(req.body.password, val.password);
    if (e) {
      let token = await val.generateAuthToken();
      res.cookie('user', token);
      if (val.isAdmin) {
        res.status(201).send(val);
      } else {
        res.status(200).send(val);
      }
    } else {
      res.status(404).send("Not Authenticated");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
