'use strict';

// this is where we will connect to our database
module.exports = (sequelize, DataTypes) => sequelize.define('User', {


  // this will create a username column automatically
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //   this will create a password column automatically
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
