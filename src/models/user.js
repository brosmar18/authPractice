'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET = process.env.SECRET;

const userSchema = (sequelizeDatabase, DataTypes) => {
    const model = sequelizeDatabase.define('user', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.VIRTUAL,
            get(){
                return jwt.sign({ username: this.username}, SECRET, {expiresIn: 1000 * 60 * 60 * 60 * 24 * 7});
            },
            set(){
                return jwt.sign({ username: this.username}, SECRET, {expiresIn: 1000 * 60 * 60 * 60 * 24 * 7});
            },
        },
    });

    model.beforeCreate(async (user) => {
        let hashedPassword = await bcrypt.hash(user.password, 5);
        console.log('Hashed password in beforeCreate: ', hashedPassword);
        user.password = hashedPassword;
    });

    model.authenticateBearer = async (token) => {
        try {
            let payload = jwt.verify(token, SECRET);
            console.log('payload', payload);
    
            const user = await model.findOne({where: {username: payload.username}});
    
            if(user){
                return user;
            }
        } catch(e) {
            console.error(e);
            return(e);
        };
    };

    return model;

};


module.exports = userSchema;