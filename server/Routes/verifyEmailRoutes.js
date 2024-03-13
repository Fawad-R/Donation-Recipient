// verifyEmailRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../Schema/UserSchema'); // Import your User model here

router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ token });

    if (user) {
      user.verified = true;
      await user.save();
      res.send('Email verified successfully.');
    } else {
      res.status(404).send('Invalid verification token.');
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).send('Error verifying email.');
  }
});

module.exports = router;
