'use strict';

// 3rd Party Resources
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { Sequelize, DataTypes } = require('sequelize');

//if you set up a different port, you can test to see if .env is working
const PORT = process.env.PORT || 3000;

// Prepare the express app
const app = express();

// Process JSON input and put the data on req.body
app.use(express.json());

// setup database url
// from class demo
const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

// Connect to the database and start the server
const sequelize = new Sequelize(process.env.DATABASE_URL);

// Process FORM intput and put the data on req.body
//allows us to accept web form data
//not needed for this lab, but good to know
app.use(express.urlencoded({ extended: true }));

// Create a Sequelize user model
//Below is starter code from repo
// const Users = sequelize.define('User', {
//class demo code:
const userModel = sequelize.define('users', {
  //notice there is no return statement here
  //will need to add later, refer to previous labs
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  //must be the word password
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//hey, this middeware exists! I can interact with the user model
userModel.beforeCreate((user) => {
  console.log('our user before being added to the db', user);
});

app.post('/signup', async (req, res, next) => {
  res.status(200).send('proof of life');
});

sequelize.sync()
  .then(()=>{
    console.log('db is connected');
    //you can start the server here by writing a start function and calling the start function.
    //or you can just start the server here by writing app.listen
    app.listen(PORT, () => console.log('listening on port' , PORT));
  })
  .catch((err)=>{
    console.error('could not start server', err);
  });


// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
app.post('/signup', async (req, res) => {

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const record = await Users.create(req.body);
    res.status(200).json(record);
  } catch (e) { res.status(403).send('Error Creating User'); }
});


// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
app.post('/signin', async (req, res) => {

  /*
    req.headers.authorization is : "Basic am9objpmb28="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'am9objpmb28=']
  let encodedString = basicHeaderParts.pop();  // am9objpmb28=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {
    const user = await Users.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { res.status(403).send('Invalid Login'); }

});

// make sure our tables are created, start up the HTTP server.
sequelize.sync()
  .then(() => {
    app.listen(3000, () => console.log('server up'));
  }).catch(e => {
    console.error('Could not start server', e.message);
  });
