const request = require('supertest');
const { createApp } = require('../src/app');

describe('HTTP application', () => {
  const app = createApp({ jwtSecret: 'test-secret-that-is-at-least-32-characters-long', jwtExpiresIn: '1h', bcryptRounds: 4 });

  test('health endpoint returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('unknown route returns a JSON 404', async () => {
    const response = await request(app).get('/not-a-route');
    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Route not found.');
  });

  test('reports require authentication', async () => {
    const response = await request(app).get('/api/v1/reports');
    expect(response.status).toBe(401);
  });
});
