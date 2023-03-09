const supertest = require('supertest');
const server = require('.');

const setup = () => {
  const serverRef = server.initServer();
  const request = supertest(serverRef);
  return { request };
}

afterEach((done) => {
  server.stopServer(done);
});

describe('API server', () => {
  test('When recieves GET: /api/v1 request, then responses with welcome message', async () => {
    const { request } = setup();
    const response = await request.get('/api/v1');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'TODO RESTful API' });
  });

  test('When recieves request to unknown route, then responses with error message', async () => {
    const { request } = setup();
    const response = await request.get('/');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(404);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'The resquested resource was not found on this server' });
  });
});