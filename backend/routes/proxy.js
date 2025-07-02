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

router.get('/:apiId', async (req, res) => {
  const start = Date.now();
  const { apiId } = req.params;
  let api = null;

  console.log('Proxy request for apiId:', apiId);
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    // Validate API ID format
    if (!mongoose.Types.ObjectId.isValid(apiId)) {
      const duration = Date.now() - start;

      await APILog.create({
        name: 'Unknown',
        endpoint: 'Unknown',
        apiId: apiId,
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
        apiId: apiId,
        status: 404,
        responseTime: duration,
        method: req.method,
        success: false
      });

      return res.status(404).json({ message: 'API not found' });
    }

    console.log('Found API:', api.name, 'Method:', api.method, 'Endpoint:', api.endpoint);

    // Setup HTTPS agent
    const httpsAgent = new https.Agent({
      rejectUnauthorized: true,
      servername: new URL(api.endpoint).hostname
    });

    // Clone headers and clean them up
    const headers = { ...req.headers };
    
    // Remove proxy-specific headers that shouldn't be forwarded
    delete headers.host;
    delete headers['if-none-match'];
    delete headers['if-modified-since'];
    delete headers['content-length']; // Let axios handle this
    delete headers.connection;
    delete headers['transfer-encoding'];

    // Ensure Content-Type is set for POST requests with body
    if ((api.method.toLowerCase() === 'post' || api.method.toLowerCase() === 'put' || api.method.toLowerCase() === 'patch') && req.body) {
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }

    const axiosConfig = {
      method: api.method.toLowerCase(), // Ensure method is lowercase
      url: api.endpoint,
      headers,
      httpsAgent,
      timeout: 30000, // 30 second timeout
      validateStatus: function (status) {
        // Accept any status code - we'll handle errors manually
        return true;
      }
    };

    // Only add data/params based on the method and if there's a body
    if (['post', 'put', 'patch'].includes(api.method.toLowerCase())) {
      if (req.body && Object.keys(req.body).length > 0) {
        axiosConfig.data = req.body;
      }
    } else if (['get', 'delete'].includes(api.method.toLowerCase())) {
      if (req.query && Object.keys(req.query).length > 0) {
        axiosConfig.params = req.query;
      }
    }

    console.log('Axios config:', JSON.stringify(axiosConfig, null, 2));

    let response;
    try {
      response = await axios(axiosConfig);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
    } catch (err) {
      // Handle axios errors
      if (err.response) {
        // Server responded with error status
        response = err.response;
        console.log('Error response status:', response.status);
        console.log('Error response data:', response.data);
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.message);
        throw new Error('No response from target API');
      } else {
        // Something else happened
        console.error('Request setup error:', err.message);
        throw err;
      }
    }

    const duration = Date.now() - start;

    // Log the request
    await APILog.create({
      name: api.name,
      endpoint: api.endpoint,
      apiId: api._id,
      status: response.status,
      responseTime: duration,
      method: req.method,
      success: response.status >= 200 && response.status < 400
    });

    // Return the response
    res.status(response.status);
    
    // Set response headers if needed
    if (response.headers['content-type']) {
      res.set('content-type', response.headers['content-type']);
    }
    
    return res.send(response.data || null);

  } catch (err) {
    const duration = Date.now() - start;

    console.error('Proxy error:', err.message);
    console.error('Error stack:', err.stack);

    // Prepare log data
    const logData = {
      name: api ? api.name : 'Unknown',
      endpoint: api ? api.endpoint : 'Unknown',
      status: err.response?.status || 500,
      responseTime: duration,
      method: req.method,
      success: false
    };

    if (api) {
      logData.apiId = api._id;
    } else {
      logData.rawApiId = apiId;
    }

    await APILog.create(logData);

    return res.status(err.response?.status || 500).json({
      message: 'Proxy error',
      error: err.response?.data || err.message
    });
  }
});

router.post('/:apiId', async (req, res) => {
  const start = Date.now();
  const { apiId } = req.params;
  let api = null;

  console.log('Proxy request for apiId:', apiId);
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    // Validate API ID format
    if (!mongoose.Types.ObjectId.isValid(apiId)) {
      const duration = Date.now() - start;

      await APILog.create({
        name: 'Unknown',
        endpoint: 'Unknown',
        apiId: apiId,
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
        apiId: apiId,
        status: 404,
        responseTime: duration,
        method: req.method,
        success: false
      });

      return res.status(404).json({ message: 'API not found' });
    }

    console.log('Found API:', api.name, 'Method:', api.method, 'Endpoint:', api.endpoint);

    // Setup HTTPS agent
    const httpsAgent = new https.Agent({
      rejectUnauthorized: true,
      servername: new URL(api.endpoint).hostname
    });

    // Clone headers and clean them up
    const headers = { ...req.headers };
    
    // Remove proxy-specific headers that shouldn't be forwarded
    delete headers.host;
    delete headers['if-none-match'];
    delete headers['if-modified-since'];
    delete headers['content-length']; // Let axios handle this
    delete headers.connection;
    delete headers['transfer-encoding'];

    // Ensure Content-Type is set for POST requests with body
    if ((api.method.toLowerCase() === 'post' || api.method.toLowerCase() === 'put' || api.method.toLowerCase() === 'patch') && req.body) {
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }

    const axiosConfig = {
      method: api.method.toLowerCase(), // Ensure method is lowercase
      url: api.endpoint,
      headers,
      httpsAgent,
      timeout: 30000, // 30 second timeout
      validateStatus: function (status) {
        // Accept any status code - we'll handle errors manually
        return true;
      }
    };

    // Only add data/params based on the method and if there's a body
    if (['post', 'put', 'patch'].includes(api.method.toLowerCase())) {
      if (req.body && Object.keys(req.body).length > 0) {
        axiosConfig.data = req.body;
      }
    } else if (['get', 'delete'].includes(api.method.toLowerCase())) {
      if (req.query && Object.keys(req.query).length > 0) {
        axiosConfig.params = req.query;
      }
    }

    console.log('Axios config:', JSON.stringify(axiosConfig, null, 2));

    let response;
    try {
      response = await axios(axiosConfig);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
    } catch (err) {
      // Handle axios errors
      if (err.response) {
        // Server responded with error status
        response = err.response;
        console.log('Error response status:', response.status);
        console.log('Error response data:', response.data);
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.message);
        throw new Error('No response from target API');
      } else {
        // Something else happened
        console.error('Request setup error:', err.message);
        throw err;
      }
    }

    const duration = Date.now() - start;

    // Log the request
    await APILog.create({
      name: api.name,
      endpoint: api.endpoint,
      apiId: api._id,
      status: response.status,
      responseTime: duration,
      method: req.method,
      success: response.status >= 200 && response.status < 400
    });

    // Return the response
    res.status(response.status);
    
    // Set response headers if needed
    if (response.headers['content-type']) {
      res.set('content-type', response.headers['content-type']);
    }
    
    return res.send(response.data || null);

  } catch (err) {
    const duration = Date.now() - start;

    console.error('Proxy error:', err.message);
    console.error('Error stack:', err.stack);

    // Prepare log data
    const logData = {
      name: api ? api.name : 'Unknown',
      endpoint: api ? api.endpoint : 'Unknown',
      status: err.response?.status || 500,
      responseTime: duration,
      method: req.method,
      success: false
    };

    if (api) {
      logData.apiId = api._id;
    } else {
      logData.rawApiId = apiId;
    }

    await APILog.create(logData);

    return res.status(err.response?.status || 500).json({
      message: 'Proxy error',
      error: err.response?.data || err.message
    });
  }
});

module.exports = router;