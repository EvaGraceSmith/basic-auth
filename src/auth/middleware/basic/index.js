'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { Users } = require('../../models');

//  Basic Authentication
module.exports = async (req, res, next) => {

  // this is the basic auth header that is sent from the client
  let basicHeaderParts = req.headers.authorization.split(' ');
  let encodedString = basicHeaderParts.pop();
  let decodedString = base64.decode(encodedString);
  let [username, password] = decodedString.split(':');

  try {
    // this is the user that matches the username that was sent from the client
    const user = await Users.findOne({ where: { username: username } });
    // this is the hashed password that is stored in the database
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.user = user;
      next();
    }
    else {
    // this is the error that is thrown if the password is invalid
      throw new Error('Invalid User');
    }
    // this is the catch block that will catch any errors that are thrown
  } catch (error) { next('Invalid Login.  message: ', error.message); }

};
