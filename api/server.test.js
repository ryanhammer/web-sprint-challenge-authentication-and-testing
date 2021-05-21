const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach( async () => {
  await db('users').truncate();
});

afterAll( async () => {
  await db.destroy();
});

const testUsers = [ 
  { username: 'Captain Marvel', password: 'foobar' },
  { username: 'Captain Marvel' },
  { password: 'foobar' },
  { username: 'Captain Marvel', password: 'foobars'}
];

// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false)
});

describe('server.js', () => {

  describe('[POST] /api/auth/register', () => {
    it("resonds w/proper message if username or password missing", async () => {
      let res = await request(server).post('/api/auth/register').send(testUsers[1]);
      expect(res.body.message).toMatch(/username and password required/i);
      res = await request(server).post('/api/auth/register').send(testUsers[2]);
      expect(res.body.message).toMatch(/username and password required/i);
    });
    it("resonds w/proper message if username already exists", async () => {
      await request(server).post('/api/auth/register').send(testUsers[0]);
      const res = await request(server).post('/api/auth/register').send(testUsers[3]);
      expect(res.body.message).toMatch(/username taken/i);
    });
  });

  describe('[POST] /api/auth/login', () => {
    it("resonds w/proper message if username or password missing", async () => {
      let res = await request(server).post('/api/auth/login').send(testUsers[1]);
      expect(res.body.message).toMatch(/username and password required/i);
      res = await request(server).post('/api/auth/login').send(testUsers[2]);
      expect(res.body.message).toMatch(/username and password required/i);
    });
    it("resonds w/proper message if password is incorrect", async () => {
      await request(server).post('/api/auth/register').send(testUsers[0]);
      const res = await request(server).post('/api/auth/login').send(testUsers[3]);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe('[GET] /api/jokes', () => {
    it('responds with a 401 status if token is missing', async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.status).toBe(401);
    });
    it("resonds with 'token required' message if token missing", async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.body.message).toMatch(/token required/i);
    });
  });

});