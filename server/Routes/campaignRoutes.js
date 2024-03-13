// campaignRoutes.js
const express = require('express');
const router = express.Router();
const Campaign = require('../Schema/CampaignSchema'); // Import your Campaign model here
const Auth = require('../Middleware/Auth'); // Import your authentication middleware if needed
const upload = require('../config/multerConfig');

router.get('/c/c/c/campaign/:id', Auth, async (req, res) => {
  try {
    console.log('herer1');
    let val = await Campaign.findOne({ _id: req.params.id });
    res.status(200).send(val);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post('/campaigns', Auth, upload.array('projectionsAndProgress'), async (req, res) => {
  try {
      console.log('here')
      const { startDate, endDate, price, description, title } = req.body;
      const progress = req.files.filter((file) => file.fieldname.startsWith('progress'));
      const newCampaign = new Campaign({
          userId: req.user._id,
          startDate,
          endDate,
          price,
          description,
          title,
          projections: req.files.map((file) => {
              return file.filename
          }), // Store image paths
          progress: progress.map((file) => file.filename), // Store image paths
      });

      await newCampaign.save();
      res.status(200).send(newCampaign);
  } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).send(error);
  }
});
router.post('/allcampaigns', Auth, upload.array('projectionsAndProgress'), async (req, res) => {
  try {
      console.log('allcampaigns here')
      const { startDate, endDate, price, description, title } = req.body;
      const progress = req.files.filter((file) => file.fieldname.startsWith('progress'));
      const newCampaign = new Campaign({
          userId: req.user._id,
          startDate,
          endDate,
          price,
          description,
          title,
          projections: req.files.map((file) => {
              return file.filename
          }), // Store image paths
          progress: progress.map((file) => file.filename), // Store image paths
      });

      await newCampaign.save();
      res.status(200).send(newCampaign);
  } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).send(error);
  }
});


router.get('/campaign/:id', Auth, async (req, res) => {
  try {
      console.log('herer')
      let val = await Campaign.findOne({ _id: req.params.id })
      res.status(200).send(val)
  } catch (error) {
      res.status(500).send(error)
  }
})
router.get('/campaign', Auth, async (req, res) => {
  try {
      console.log('bal.data')
      let val = await Campaign.find()
      console.log('val', val)
      res.status(200).send(val)
  } catch (error) {
      res.status(500).send(error)
  }
})

router.get('/Allcampaigns', async (req, res) => {
  console.log('i am Allcampaigns')
  try {
      console.log('i am Allcampaigns')
      console.log('bal.data')
      let val = await Campaign.find()
      // console.log('val',val)
      res.status(200).send(val)
  } catch (error) {
      console.log('i am Allcampaigns')
      res.status(500).send(error)
  }
})

router.put('/campaign/:id', Auth, async (req, res) => {
  try {
      let value = await Campaign.findOne({ _id: req.params.id })
      if (req.user.isAdmin || req.user._id === value.userId) {
          let val = await Campaign.findOneAndUpdate({ _id: req.params.id }, req.body)
          if (val === null) {
              res.status(404).send('error');
          }
          else {
              res.status(200).send(val);
          }
      }
      else {
          res.status(403).send('Not Autheticated Admin or a User');
      }
  } catch (error) {
      res.status(500).send(error);
  }
})

// #delete
router.delete('/campaign/:id', Auth, async (req, res) => {
  try {
      console.log(' herer')
      let value = await Campaign.findOne({ _id: req.params.id })
      console.log('402', value)
      if (req.user.isAdmin || req.user._id === value.userId) {
          console.log('4020')
          let val = await Campaign.findOneAndDelete({ _id: req.params.id })
          console.log('4021')

          if (val === null) {
              console.log('4022')
              res.status(404).send('error');
          }
          else {
              console.log('4023')
              res.status(200).send(val);
          }
          console.log('4024')
      }
      else {
          // res.status(200).send(val);
          res.send('error');
          // res.status(403).json({ error: 'Access denied. Your error message here.' });
          // res.status(403).json({ error: 'Access denied. Your error message here.' });

          console.log('403')
          console.log('403')
      }
  } catch (error) {
      console.log(error)
      res.status(500).send(error);
  }
})


module.exports = router;
