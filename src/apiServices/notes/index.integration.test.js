const supertest = require('supertest');
const isValidDate = require('../../util/isValidDate');
const mongoMemory = require('../../config/mongoMemory');
const app = require('../../app');
const Note = require('./DAL/model/Note');
const notesBLL = require('./BLL');

const request = supertest(app);
const basePath = '/api/v1';

const setup = () => { // equivalent to beforeEach, useful to prevent global variables
  
  const basePath = '/api/v1';
  const notesPath = `${basePath}/notes`;
  const dummyNote = { content: 'note content' };
  const dummyNoteList = new Array(12).fill(dummyNote);

  const populateDB = async (data) => { // data can be one Object or an Array of Objects
    await Note.create(data, { lean: true });
  }

  return { notesPath, dummyNote, dummyNoteList, populateDB };
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


describe('POST /notes', () => {
  test('When creates a new note, then should return new note record as a JSON with status code 201', async () => {
    const { dummyNote, notesPath } = setup();
    
    const response = await request
      .post(notesPath)
      .send(dummyNote);

    const { status, headers, body } = response;
    
    expect(status).toBe(201);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({
      id: expect.any(String),
      content: dummyNote.content,
      isDone: false,
      createdAt: expect.any(String)
    });
    expect(isValidDate(body.createdAt)).toBeTruthy();
  });

  test('When missing "conent" field, then should return error message as a JSON with status code 400', async () => {
    const { notesPath } = setup();

    const response = await request
      .post(notesPath)
      .send({});

    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Required key(s): content' });
  });

  test('When unhandled error occurs, then should return an error message as a JSON with status code 500', async () => {
    jest //this is an stub with jest using spyOn
      .spyOn(notesBLL, 'create')
      .mockRejectedValue(new Error('random error'));
    
    const response = await request.post(`${basePath}/notes`);
    const { status, headers, body } = response;
    
    expect(status).toBe(500);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Server Error' });
  });
});

describe('GET /notes', () => {
  test('When request all notes, then should return 10 notes at most by default as a JSON with status code 200', async () => {
    const { populateDB } = setup();
    const dummyList = new Array(12).fill({
      content: 'note content'
    });
    await populateDB(dummyList);

    const response = await request.get(`${basePath}/notes`);

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
  
  test('When request only 5 notes, then should return 4 notes as a JSON with status code 200', async () => {
    const { populateDB, notesPath } = setup();
    const dummyList = new Array(12).fill({
      content: 'note content'
    });    
    await populateDB(dummyList);

    const response = await request.get(`${notesPath}?limit=5`);

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

  test.todo('When recieve not valid "limit" param, then should retireves a bad request message as a JSON with status code 400');

  test('When unhandled error occurs, then should return an error message as a JSON with status code 500', async () => {
    jest
      .spyOn(notesBLL, 'readAll')
      .mockRejectedValue(new Error('random error'));

    const response = await request.get(`${basePath}/notes`);

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual({ message: 'Server Error' });
  });
});

// describe('GET /notes/:noteId', () => {});

// describe('PATCH /notes/:noteId', () => {});

// describe('DELETE /notes/:noteId', () => {});