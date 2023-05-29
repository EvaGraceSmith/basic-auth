'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const { sequelize } = require('../src/auth/models');

const request = supertest(app);

beforeAll(async () => {
  await sequelize.sync();
},
);

afterAll(async () => {
  await sequelize.drop();
},
);

//allow for user signup
//allow for user signin
//will not allow user to signin with incorrect password
//will not allow user to signin with incorrect username



describe('Testing our auth routes', () => {
  test ('POST to /signup to create a new user', async () => {
    const response = await request.post('/signup').send({
      username: 'test',
      password: 'test',
    });
    expect(response.status).toEqual(201);
    expect(response.body.username).toEqual('test');
  },
  );

  test ('POST to /signin to login as a user (use basic auth)', async () => {
    const response = await request.post('/signin').auth('test', 'test');
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('test');
  },
  );

  test ('will not allow user to signin with incorrect password', async () => {
    const response = await request.post('/signin').auth('test', 'wrong');
    expect(response.status).toEqual(500);
  },
  );

  test ('will not allow user to signin with incorrect username', async () => {
    const response = await request.post('/signin').auth('wrong', 'test');
    expect(response.status).toEqual(500);
  },
  );
  
},
);






