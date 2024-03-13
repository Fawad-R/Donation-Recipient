// systemSettingsRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const SystemSettings = require('../Schema/SystemSettingsSchema'); // Import your SystemSettings model here

router.get('/system-settings', async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({});
    res.status(200).send(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).send(error);
  }
});

// Check if a SystemSettings document exists; if not, create one

// Update Existing Document
async function createDefaultSystemSettings() {
    try {
        const doc = await SystemSettings.findOne({});
        if (!doc) {
            // Create a new document with default values
            const newSettings = new SystemSettings({
                systemName: 'Default System Name',
                title: 'Default Title',
                email: 'default@example.com',
                mobile: '1234567890',
                types: [],
            });
            await newSettings.save();
        }
    } catch (error) {
        console.error('Error checking or creating SystemSettings:', error);
    }
}

createDefaultSystemSettings();
router.post('/system-settings', async (req, res) => {

    const { systemName, title, email, mobile,types } = req.body;
    try {
        const existingSettings = await SystemSettings.findOne({});
        if (existingSettings) {
            existingSettings.systemName = systemName;
            existingSettings.title = title;
            existingSettings.email = email;
            existingSettings.mobile = mobile;
            existingSettings.types = types;
            await existingSettings.save();
            res.json({ message: 'Settings updated successfully' });
        } else {
            res.status(404).json({ error: 'Settings not found' });
        }
    } catch (error) {
        console.error('Error updating system settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/upload-assets', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), async (req, res) => {
    try {
        const { logo, favicon } = req.files;

        if (logo && logo.length > 0) {
            // userData.profilePicture = req.file.filename;
            // console.log(logo[0])
            const logoPath = logo[0].filename;
            await SystemSettings.updateOne({}, { logo: logoPath });
        }

        if (favicon && favicon.length > 0) {
            const faviconPath = favicon[0].filename;
            await SystemSettings.updateOne({}, { favicon: faviconPath });
        }

        res.json({ message: 'Assets uploaded successfully' });
    } catch (error) {
        console.error('Error updating assets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// *************************
// router.post('/api/types', (req, res) => {
//     const newType = req.body;
//     typeCollection.insertOne(newType, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error creating a Type' });
//         return;
//       }
//       res.status(201).json(result.ops[0]);
//     });
//   });

//   // Read all Types
//   router.get('/api/types', (req, res) => {
//     typeCollection.find().toArray((err, types) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error fetching Types' });
//         return;
//       }
//       res.json(types);
//     });
//   });

//   // Update a Type
//   router.put('/api/types/:id', (req, res) => {
//     const typeId = req.params.id;
//     const updatedType = req.body;

//     typeCollection.findOneAndUpdate(
//       { _id: new ObjectID(typeId) },
//       { $set: updatedType },
//       (err, result) => {
//         if (err) {
//           console.error(err);
//           res.status(500).json({ error: 'Error updating the Type' });
//           return;
//         }
//         res.json(result.value);
//       }
//     );
//   });

//   // Delete a Type
//   router.delete('/api/types/:id', (req, res) => {
//     const typeId = req.params.id;
//     typeCollection.deleteOne({ _id: new ObjectID(typeId) }, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error deleting the Type' });
//         return;
//       }
//       res.json({ message: 'Type deleted' });
//     });
//   });


module.exports = router;
