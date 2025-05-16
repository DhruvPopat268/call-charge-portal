const express = require('express');
const APILog = require('../models/APILog');
const router = express.Router();

// Summary route
// router.get('/summary/:apiId', async (req, res) => {
//   const { apiId } = req.params;

//   try {
//     const logs = await APILog.find({ apiId });

//     if (logs.length === 0) {
//       return res.status(404).json({ message: 'No logs found for this API' });
//     }

//     const totalCalls = logs.length;
//     const successfulCalls = logs.filter(log => log.success).length;
//     const failedCalls = totalCalls - successfulCalls;
//     const avgResponseTime = Math.round(
//       logs.reduce((sum, log) => sum + log.responseTime, 0) / totalCalls
//     );

//     // Status code breakdown
//     const statusCounts = {};
//     logs.forEach(log => {
//       const code = log.status;
//       statusCounts[code] = (statusCounts[code] || 0) + 1;
//     });

//     res.json({
//       totalCalls,
//       successfulCalls,
//       failedCalls,
//       avgResponseTime,
//       statusCounts
//     });

//   } catch (err) {
//     console.error('Summary error:', err.message);
//     res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
//   }
// });

router.get('/summary', async (req, res) => {
  

  try {
    const logs = await APILog.find().populate('apiId');

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No logs found for this API' });
    }

    const totalCalls = logs.length;
    const successfulCalls = logs.filter(log => log.success).length;
    const failedCalls = totalCalls - successfulCalls;
    const avgResponseTime = Math.round(
      logs.reduce((sum, log) => sum + log.responseTime, 0) / totalCalls
    );

    // Status code breakdown
    const statusCounts = {};
    logs.forEach(log => {
      const code = log.status;
      statusCounts[code] = (statusCounts[code] || 0) + 1;
    });

    res.json({
      totalCalls,
      successfulCalls,
      failedCalls,
      avgResponseTime,
      statusCounts
    });

  } catch (err) {
    console.error('Summary error:', err.message);
    res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
  }
});

module.exports = router;
