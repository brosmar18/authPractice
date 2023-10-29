'use strict';

const express = require('express');
const authRouter = require('./routes/auth');

require('dotenv').config();
const PORT = process.env.PORT || 5002;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.use('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});



const start = () => {
    app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
};

module.exports = {start, app};
