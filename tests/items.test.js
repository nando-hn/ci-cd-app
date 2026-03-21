const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/models/db');

beforeAll(async () => {
  await pool.query('DELETE FROM items');
});

afterAll(async () => {
  await pool.end();
});

describe('Items API', () => {

  test('GET /items should return empty array', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /items should create item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Test item' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test item');
  });

  test('POST /items should return 400 if name is missing', async () => {
    const res = await request(app)
      .post('/items')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Name is required');
  });

  test('GET /items should return items', async () => {
    const res = await request(app).get('/items');
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('DELETE /items/:id should delete item', async () => {
    const create = await request(app)
      .post('/items')
      .send({ name: 'To delete' });

    const res = await request(app)
      .delete(`/items/${create.body.id}`);

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /items/:id should return 404', async () => {
    const res = await request(app).delete('/items/9999');
    expect(res.statusCode).toBe(404);
  });

});
