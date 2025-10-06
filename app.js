const express = require("express");
const app = express();

app.use(express.json());
app.use("/convo", require("./Route/route"));

module.exports = app;
