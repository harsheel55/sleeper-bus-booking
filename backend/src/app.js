const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
