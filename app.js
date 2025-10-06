<<<<<<< HEAD
const express = require("express");
const app = express();

app.use(express.json());
app.use("/convo", require("./Route/route"));
=======
const express = require('express');
const app = express();

app.use('/convo', require('./Route/route'));
>>>>>>> f37ee7e4cf386f6668c302a4b4fc23d7bc0ba189

module.exports = app;
