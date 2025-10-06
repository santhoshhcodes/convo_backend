const express = require('express');
const HTTP_SERVER = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
require('./dbConfig');

HTTP_SERVER.use(express.json());
HTTP_SERVER.use(express.urlencoded({ extended: false }));
HTTP_SERVER.use(cors());

HTTP_SERVER.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

HTTP_SERVER.use('/', require('./app'));