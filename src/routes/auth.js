'use strict';

const express = require('express');
const { userModel } = require('../models');
const basicAuth = require('../middleware/auth/basicAuth');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        let newUser = await userModel.create(req.body);
        res.status(200).send(newUser);
    } catch (e) {
        next('Signup error occurred!');
    }
});

router.post('/signin', basicAuth, async (req, res, next) => {
    res.status(200).send(req.user);
});

module.exports = router;