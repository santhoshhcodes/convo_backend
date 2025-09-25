const express = require('express');
const app = express();

app.use('/convo', require('./Route/route'));

module.exports = app;
