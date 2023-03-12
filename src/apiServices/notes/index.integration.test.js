const supertest = require('supertest');
const mongoMemory = require('../../config/mongoMemory');
const app = require('../../app');
const Note = require('./DAL/model/Note');
const notesBLL = require('./BLL');

const request = supertest(app);
const basePath = '/api/v1';

const setup = () => { // equivalent to beforeEach, useful to prevent global variables
  
  const populateDB = async (data) => { // data can be one Object or an Array of Objects
    await Note.create(data, { lean: true });
  }

  return { populateDB }
}

beforeAll(async () => {
  await mongoMemory.openConnection();
});

afterEach(async () => {
  jest.restoreAllMocks();
  await mongoMemory.dropCollections();
})

afterAll(async () => {
  await mongoMemory.closeConnection();
});

describe('GET /notes', () => {
  test('When request all notes, then should retrieves 10 notes at most by default as a JSON with status code 200', async () => {
    // ARRANGA
    const { populateDB } = setup();
    const dummyList = new Array(12).fill({
      content: 'note content'
    });
    await populateDB(dummyList);


    // ACT
    const response = await request.get(`${basePath}/notes`);

    //ASSERT
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.length).toBeLessThanOrEqual(10);

    response.body.forEach((document) => {
      expect(document).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        isDone: expect.any(Boolean),
        createdAt: expect.any(String),
      })
    });
  });
  
  test('When request only 5 notes, then should retrieves 4 notes as a JSON with status code 200', async () => {
    const { populateDB } = setup();
    const dummyList = new Array(12).fill({
      content: 'note content'
    });    
    await populateDB(dummyList);

    const response = await request.get(`${basePath}/notes?limit=5`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.length).toBeLessThanOrEqual(5);

    response.body.forEach((document) => {
      expect(document).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        isDone: expect.any(Boolean),
        createdAt: expect.any(String),
      })
    });
  });

  test('When unhandled error occurs, then should retrieves a an error message as a JSON with status code 500', async () => {
    jest
      .spyOn(notesBLL, 'readAll')
      .mockRejectedValue(new Error('random error'));

    const response = await request.get(`${basePath}/notes`);

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual({ message: 'Server Error' });
  });
});