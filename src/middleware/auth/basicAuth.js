'use strict';

const base64 = require('base-64');
const bcrypt = require('bcrypt');
const { userModel } = require('../../models');

module.exports = async (req, res, next) => {
    let { authorization } = req.headers;
    console.log('Auth String: ', authorization);

    // 1. isolate the encoded part of the string.
    let authString = authorization.split(' ')[1];
    console.log('authString: ', authString);

    // 2. I need to decode the isolated string.
    let decodedAuthString = base64.decode(authString);
    console.log('decodedAuthString: ', decodedAuthString);

    // 3. I need to isolate the password FROM the decoded string. username:password
    let [username, password] = decodedAuthString.split(':');
    console.log('username: ', username, 'password: ', password);

    let user = await userModel.findOne({ where: {username}});
    console.log('User: ', user);
    if(user) {
        let validUser = await bcrypt.compare(password, user.password);
        if(validUser) {
            req.user = user;
            next();
        } else {
            next('Not Auhtorized (password incorrect');
        }
    } else {
        next('Not Authorized (user doesn\'t exist in DB');
    }
};
