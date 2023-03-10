const supertest = require('supertest');
const httpServer = require('.');

const setup = () => {
  const serverRef = httpServer.startServer();
  const request = supertest(serverRef);
  return { request };
}

afterEach((done) => {
  httpServer.stopServer(done);
});

describe('API http server', () => {
  test('When recieves GET: /api/v1 request, then responses with welcome message', async () => {
    const { request } = setup();
    const response = await request.get('/api/v1');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'TODO RESTful API' });
  });

  test('When recieves request to unknown route, then responses with server error message', async () => {
    const { request } = setup();
    const response = await request.get('/');
    const { statusCode, headers, body } = response;
    expect(statusCode).toBe(404);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'The resquested resource was not found on this server' });
  });
});