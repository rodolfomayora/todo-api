const supertest = require('supertest');
const mongoMemory = require('../mongoMemory');
const httpServer = require('.');

const setup = () => {
  const serverRef = httpServer.startServer();
  const request = supertest(serverRef);
  return { request };
}

const setupWithMongo = async () => {
  const config = setup();
  await mongoMemory.openConnection();
  return { ...config };
}

afterEach(async () => {
  await mongoMemory.closeConnection();
  httpServer.stopServer();
});

describe('API http server', () => {
  test('When recieves GET: /api/v1 request, then responses with welcome message', async () => {
    const { request } = await setupWithMongo();
    const response = await request.get('/api/v1');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'TODO RESTful API' });
  });

  test('When recieves request to unknown route, then responses with 404 server error message', async () => {
    const { request } = await setupWithMongo();
    const response = await request.get('/random');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(404);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'The resquested resource was not found on this server' });
  });

  test('When recieves request and database is not connected, then responses with 503 server error message', async () => {
    const { request } = setup();
    const response = await request.get('/api/v1');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(503);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'MongoDB not connected yet' });
  });
});