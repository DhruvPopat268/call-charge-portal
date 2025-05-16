// // const express = require('express');
// // const axios = require('axios');
// // const API = require('../models/API');
// // const APILog = require('../models/APILog');
// // const router = express.Router();

// // router.all('/:apiId', async (req, res) => {
// //   try {
// //     const { apiId } = req.params;

// //     const api = await API.findById(apiId);
// //     if (!api) return res.status(404).json({ message: 'API not found' });

// //     const start = Date.now();

// //     const axiosConfig = {
// //       method: api.method,
// //       url: api.url,
// //       headers: req.headers,
// //       data: req.body
// //     };

// //     const response = await axios(axiosConfig);

// //     const duration = Date.now() - start;

// //     // Log the request
// //     await APILog.create({
// //       apiId: api._id,
// //       status: response.status,
// //       responseTime: duration,
// //       method: api.method,
// //       success: true
// //     });

// //     // Return actual response to caller
// //     res.status(response.status).send(response.data);

// //   } catch (err) {
// //     console.log(err)
// //     const duration = Date.now() - start;

// //     // Even if error, log it
// //     await APILog.create({
// //       apiId: req.params.apiId,
// //       status: err.response?.status || 500,
// //       responseTime: duration,
// //       method: req.method,
// //       success: false
// //     });

// //     res.status(err.response?.status || 500).json({ message: 'Proxy error', error: err.message });
// //   }
// // });

// // module.exports = router;


// -------------------------------------> https agent do not use in production 


// const express = require('express');
// const axios = require('axios');
// const https = require('https');
// const API = require('../models/API');
// const APILog = require('../models/APILog');
// const router = express.Router();

// router.all('/:apiId', async (req, res) => {
//   const start = Date.now(); // To calculate response time

//   try {
//     const { apiId } = req.params;

//     const api = await API.findById(apiId);
//     if (!api) return res.status(404).json({ message: 'API not found' });

//     // Create HTTPS agent to handle TLS issues (disable cert validation for local only)
//     const httpsAgent = new https.Agent({
//       rejectUnauthorized: false,
//       servername: new URL(api.url).hostname // Fix SNI issue
//     });

//     // Clone headers excluding host (which can break proxy behavior)
//     const filteredHeaders = { ...req.headers };
//     delete filteredHeaders.host;

//     const axiosConfig = {
//       method: api.method,
//       url: api.url,
//       headers: filteredHeaders,
//       data: req.body,
//       httpsAgent
//     };

//     const response = await axios(axiosConfig);
//     const duration = Date.now() - start;

//     // Log success
//     await APILog.create({
//       apiId: api._id,
//       status: response.status,
//       responseTime: duration,
//       method: api.method,
//       success: true
//     });

//     res.status(response.status).send(response.data);

//   } catch (err) {
//     const duration = Date.now() - start;

//     // Log failure
//     await APILog.create({
//       apiId: req.params.apiId,
//       status: err.response?.status || 500,
//       responseTime: duration,
//       method: req.method,
//       success: false
//     });

//     console.error('Proxy Error:', err.message);
//     res.status(err.response?.status || 500).json({
//       message: 'Proxy error',
//       error: err.message
//     });
//   }
// });

// module.exports = router;

//----------------------->> for invalid api id also will count as failure

const express = require('express');
const axios = require('axios');
const https = require('https');
const mongoose = require('mongoose');
const API = require('../models/API');
const APILog = require('../models/APILog');
const router = express.Router();

router.get('/logs', async (req, res) => {
  try {
    const logs = await APILog.find({}) // populates details from the API collection

    res.json(logs);
  } catch (err) {
    console.error('Error fetching all logs:', err.message);
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
})

router.get('/logs/stats', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch logs from last 7 days using `timestamp`
    const logs = await APILog.find({ timestamp: { $gte: sevenDaysAgo } });

    if (logs.length === 0) {
      return res.json({
        totalCalls: 0,
        averageCalls: 0,
        peakDay: 'N/A',
        peakDayCalls: 0
      });
    }

    const totalCalls = logs.length;
    const dailyCounts = {};

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      dailyCounts[key] = (dailyCounts[key] || 0) + 1;
    });

    const peakDay = Object.keys(dailyCounts).reduce((a, b) => dailyCounts[a] > dailyCounts[b] ? a : b);
    const peakDayCalls = dailyCounts[peakDay];
    const averageCalls = totalCalls / 7;

    res.json({
      totalCalls,
      averageCalls: Math.round(averageCalls),
      peakDay,
      peakDayCalls
    });

  } catch (err) {
    console.error('Error getting log stats:', err.message);
    res.status(500).json({ message: 'Error getting log stats', error: err.message });
  }
});

router.get('/logs/daily-usage', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today

    const logs = await APILog.find({ timestamp: { $gte: sevenDaysAgo } });

    const usageMap = {};

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const key = date.toISOString().slice(0, 10); // Format: "YYYY-MM-DD"
      usageMap[key] = (usageMap[key] || 0) + 1;
    });

    // Generate last 7 days including today
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);

      result.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calls: usageMap[key] || 0
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Error getting daily usage:', err.message);
    res.status(500).json({ message: 'Failed to fetch daily usage', error: err.message });
  }
});

router.get('/logs/usage-by-api', async (req, res) => {
  try {
    const result = await APILog.aggregate([
      {
        $group: {
          _id: "$name", // assuming this field stores API names like 'Weather API'
          calls: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          calls: 1
        }
      },
      {
        $sort: { calls: -1 }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error('Error fetching usage by API:', err.message);
    res.status(500).json({ message: 'Failed to fetch API usage data', error: err.message });
  }
});

// GET /logs/usage-by-endpoint
router.get('/logs/usage-by-endpoint', async (req, res) => {
  try {
    const result = await APILog.aggregate([
      {
        $group: {
          _id: { method: "$method", path: "$endpoint" },
          calls: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: { $concat: ["$_id.method", " ", "$_id.path"] },
          calls: 1
        }
      },
      {
        $sort: { calls: -1 }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error('Error fetching endpoint usage:', err.message);
    res.status(500).json({ message: 'Failed to fetch usage data', error: err.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const logs = await APILog.find({}, { name: 1, success: 1, timestamp: 1 }) // only required fields
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recent logs' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const logs = await APILog.find();

    const totalCalls = logs.length;

    const activeApis = new Set(logs.map(log => log.apiId.toString())).size;

    const avgResponseTime = (
      logs.reduce((sum, log) => sum + log.responseTime, 0) / totalCalls
    ).toFixed(1);

    const successfulCalls = logs.filter(log => log.success === true).length;
    const successRate = ((successfulCalls / totalCalls) * 100).toFixed(1);

    res.json({
      totalCalls,
      activeApis,
      avgResponseTime,
      successRate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.all('/:apiId', async (req, res) => {
  const start = Date.now();
  const { apiId } = req.params;
  let api = null;

  try {
    // Validate API ID format
    if (!mongoose.Types.ObjectId.isValid(apiId)) {
      const duration = Date.now() - start;
      await APILog.create({
        name: 'Unknown',
        endpoint: 'Unknown',
        apiId: null,
        rawApiId: apiId,
        status: 400,
        responseTime: duration,
        method: req.method,
        success: false
      });

      return res.status(400).json({ message: 'Invalid API ID' });
    }

    // Retrieve API document
    api = await API.findById(apiId);
    if (!api) {
      const duration = Date.now() - start;
      await APILog.create({
        name: 'Unknown',
        endpoint: 'Unknown',
        apiId: null,
        rawApiId: apiId,
        status: 404,
        responseTime: duration,
        method: req.method,
        success: false
      });

      return res.status(404).json({ message: 'API not found' });
    }

    // Setup HTTPS agent
    const httpsAgent = new https.Agent({
      rejectUnauthorized: true,
      servername: new URL(api.endpoint).hostname
    });

    // Clone headers, strip problematic ones
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['if-none-match'];
    delete headers['if-modified-since'];

    const axiosConfig = {
      method: api.method,
      url: api.endpoint,
      headers,
      data: req.body,
      httpsAgent
    };

    let response;
    try {
      response = await axios(axiosConfig);
    } catch (err) {
      // Treat 304 Not Modified as success
      if (err.response && err.response.status === 304) {
        response = err.response;
      } else {
        throw err;
      }
    }

    const duration = Date.now() - start;

    // Log success including 304
    await APILog.create({
      name: api.name,
      endpoint: api.endpoint,
      apiId: api._id,
      status: response.status,
      responseTime: duration,
      method: api.method,
      success: true
    });

    return res.status(response.status).send(response.data || null);

  } catch (err) {
    const duration = Date.now() - start;

    await APILog.create({
      name: api ? api.name : 'Unknown',
      endpoint: api ? api.endpoint : 'Unknown',
      apiId: api ? api._id : null,
      rawApiId: api ? undefined : apiId,
      status: err.response?.status || 500,
      responseTime: duration,
      method: req.method,
      success: false
    });

    console.error('Error in proxy:', err.message);

    return res.status(err.response?.status || 500).json({
      message: 'Proxy error',
      error: err.message
    });
  }
});







module.exports = router;
