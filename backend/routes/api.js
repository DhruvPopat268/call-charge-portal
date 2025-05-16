const express = require('express');
const API = require('../models/API');
const AdminVerifyToken = require('../middleware/AdminVerifyToken');

const router = express.Router();

// ➕ Add API
router.post('/add', AdminVerifyToken, async (req, res) => {

  try {
    const { name, endpoint, description, price, method } = req.body;
    const adminId = req.admin; // this should be set by AdminVerifyToken
    console.log('admin ID from token:', adminId);

    if (!name || !endpoint) {
      return res.status(400).json({ message: "Name and URL are required." });
    }

    const newAPI = new API({ name, endpoint, description, price, method, adminId });
    const savedApi = await newAPI.save();

    // 3. Generate proxy URL
    const proxyUrl = `http://localhost:7000/proxy/${savedApi._id}`;

    // 4. Update the saved document with proxyUrl
    savedApi.proxyUrl = proxyUrl;
    await savedApi.save(); // Update again

    res.status(201).json({
      message: 'API added successfully',
      api: savedApi, proxyUrl
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to add API', error: err.message });
  }
});

module.exports = router;

// 📄 List APIs (for logged-in admin)
router.get('/list', AdminVerifyToken, async (req, res) => {
  try {
    console.log('Fetching APIs for admin:', req.admin);
    const apis = await API.find({ adminId: req.admin });
    // const ListOfAPI = apis.map(api => api.url);
    res.status(200).json(apis);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch APIs', error: err.message });
  }
});

// ❌ Delete API
router.delete('/:id', AdminVerifyToken, async (req, res) => {
  try {
    const deleted = await API.findOneAndDelete({ _id: req.params.id, adminId: req.admin });
    if (!deleted) return res.status(404).json({ message: 'API not found or not authorized' });

    res.status(200).json({ message: 'API deleted successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to delete API', error: err.message });
  }
});

// PUT /api/:id - Update a specific API
router.put('/:id', async (req, res) => {
  try {
    const updatedApi = await API.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedApi) {
      return res.status(404).json({ message: 'API not found' });
    }

    res.status(200).json(updatedApi);
  } catch (err) {
    console.error('Error updating API:', err);
    res.status(500).json({ message: 'Server error while updating API' });
  }
});


module.exports = router;
