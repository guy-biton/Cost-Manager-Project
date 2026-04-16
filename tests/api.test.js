const request = require('supertest');
const usersApp = require('../users_service');
const costsApp = require('../costs_service');
const logsApp = require('../logs_service');
const aboutApp = require('../about_service');

const User = require('../models/User');
const Cost = require('../models/Cost');
const Log = require('../models/Log');
const Report = require('../models/Report');

jest.mock('../models/User');
jest.mock('../models/Cost');
jest.mock('../models/Log');
jest.mock('../models/Report');

describe('Logs Service', () => {
  it('GET /api/logs should return an array of logs', async () => {
    Log.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([{ message: 'test log' }]) });
    const res = await request(logsApp).get('/api/logs');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].message).toBe('test log');
  });
});

describe('About Service', () => {
  it('GET /api/about should return team details', async () => {
    const res = await request(aboutApp).get('/api/about');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
    expect(res.body[0]).toHaveProperty('first_name');
  });
});

describe('Users Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/add should add a new user', async () => {
    User.findOne.mockResolvedValue(null);
    const mockUser = { toJSON: () => ({ id: 123, first_name: 'test' }) };
    User.create.mockResolvedValue(mockUser);

    const res = await request(usersApp)
      .post('/api/add')
      .send({ id: 123, first_name: 'test', last_name: 'user', birthday: '2000-01-01' });

    expect(res.statusCode).toBe(200);
    expect(res.body.first_name).toBe('test');
  });

  it('POST /api/add should fail if user exists', async () => {
    User.findOne.mockResolvedValue({ id: 123 });
    const res = await request(usersApp).post('/api/add').send({ id: 123, first_name: 't', last_name: 'u', birthday: '2020-01-01' });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/users should return all users', async () => {
    User.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([{ id: 123 }]) });
    const res = await request(usersApp).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /api/users/:id should return user with total costs', async () => {
    User.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ id: 123, first_name: 'test' }) });
    Cost.aggregate.mockResolvedValue([{ total: 50 }]);
    const res = await request(usersApp).get('/api/users/123');
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(50);
  });
});

describe('Costs Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/add should add a new cost', async () => {
    User.findOne.mockResolvedValue({ id: 123 });
    const mockCost = { toJSON: () => ({ description: 'milk', category: 'food' }) };
    Cost.create.mockResolvedValue(mockCost);

    const res = await request(costsApp)
      .post('/api/add')
      .send({ userid: 123, description: 'milk', sum: 10, category: 'food' });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('milk');
  });

  it('GET /api/report should return correctly formatted monthly costs', async () => {
    User.findOne.mockResolvedValue({ id: 123 });
    
    Report.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    
    const mockCosts = [
      { category: 'food', sum: 10, description: 'milk', createdAt: new Date() },
      { category: 'education', sum: 50, description: 'book', createdAt: new Date() }
    ];
    Cost.find.mockResolvedValue(mockCosts);

    const res = await request(costsApp).get('/api/report?id=123&year=2020&month=5');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.costs).toEqual(expect.any(Array));
    expect(res.body.costs[0].food.length).toBe(1);
  });
});
