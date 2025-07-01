require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectToDb = require('./database/db')
const apiRoutes = require('./routes/api');
const proxyRoutes = require('./routes/proxy');
const logRoutes = require('./routes/log');
const cookieParser = require('cookie-parser')
const planRoutes = require('./routes/planRoutes');
const cors = require('cors');

const AdminauthRoutes = require('./routes/Adminauth');
const UserauthRoutes = require('./routes/UserAuth')

const app = express();

connectToDb()

app.use(cors({
    origin:[
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://api-monitoring-and-purchasing-platform-oe4m.onrender.com",
        "https://my.geotab.com"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth/admin', AdminauthRoutes);
app.use('/auth/user', UserauthRoutes);

app.use('/api', apiRoutes);
app.use('/proxy', proxyRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/plans', planRoutes);

app.listen(7000,()=>{console.log('Server is running on port 7000')})