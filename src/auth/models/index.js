'use strict';
// this is where we will connect to our database
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./user');

// this conditional assignment, makes our database testable
// if we are in our test env, we will use an in memory database
// otherwise, we will use the URL from the env file
const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory:' : process.env.DATABASE_URL;

// this will create our sequelize instance, and connect it to our database
const sequelize = new Sequelize(DATABASE_URL);

// this will create our model classes from the schema and sequelize
const Users = userSchema(sequelize, DataTypes);

module.exports = { sequelize, Users };
