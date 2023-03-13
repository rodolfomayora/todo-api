const supertest = require('supertest');
const isValidDate = require('../../util/isValidDate');
const mongoMemory = require('../../config/mongoMemory');
const app = require('../../app');
const Note = require('./DAL/model/Note');
const notesBLL = require('./BLL');

const request = supertest(app);

const setup = () => { // equivalent to beforeEach, useful to prevent global variables
  const basePath = '/api/v1';
  const dummyId = '640e97d32bf39abc3af74848';
  const dummyNote = { content: 'note content' };
  const dummyNoteUpdate = { content: 'note content updated' };
  const dummyNoteList = new Array(12).fill(dummyNote);

  // @data can be one Object or an Array of Objects
  const createDocument = async (data) => await Note.create(data);

  return {
    basePath,
    dummyId,
    dummyNote,
    dummyNoteList,
    dummyNoteUpdate,
    createDocument
  };
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
    const { basePath, dummyNote } = setup();
    
    const response = await request
      .post(`${basePath}/notes`)
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

  test('When missing "content" field, then should return bad request message as a JSON with status code 400', async () => {
    const { basePath } = setup();
    const emptyRequestbody = {};

    const response = await request
      .post(`${basePath}/notes`)
      .send(emptyRequestbody);

    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Required key(s): \'content\'.' });
  });

  test('When "content" is too long (length > 100), then should return bad request message as a JSON with status code 400', async () => {
    const { basePath } = setup();
    const tooLongString = new Array(102).fill('s').join('');

    const response = await request
      .post(`${basePath}/notes`)
      .send({ content:  tooLongString });

    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Unexpected value(s): \'content\' should have at most a hundred (100) letters.' });
  });

  test('When unhandled error occurs, then should return server error message as a JSON with status code 500', async () => {
    const { basePath } = setup();
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
    const { createDocument, basePath, dummyNoteList } = setup();
    await createDocument(dummyNoteList);

    const response = await request.get(`${basePath}/notes`);
    const { status, headers, body } = response;

    expect(status).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body.length).toBeLessThanOrEqual(10);

    body.forEach((document) => {
      expect(document).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        isDone: expect.any(Boolean),
        createdAt: expect.any(String),
      });
      expect(isValidDate(document.createdAt)).toBeTruthy();
    });
  });
  
  test('When request only 5 notes, then should return 4 notes as a JSON with status code 200', async () => {
    const { createDocument, basePath, dummyNoteList } = setup();
    await createDocument(dummyNoteList);

    const response = await request.get(`${basePath}/notes?limit=5`);
    const { status, headers, body } = response;

    expect(status).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body.length).toBeLessThanOrEqual(5);

    body.forEach((document) => {
      expect(document).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        isDone: expect.any(Boolean),
        createdAt: expect.any(String),
      })
    });
  });

  test('When recieve not valid "limit" param, then should return bad request message as a JSON with status code 400', async () => {
    const { createDocument, basePath, dummyNoteList } = setup();
    await createDocument(dummyNoteList);

    const response = await request.get(`${basePath}/notes?limit=no_valid_limit`);
    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Unexpected value(s): \'limit\' should be an integer number.' });
  });

  test('When unhandled error occurs, then should return server error message as a JSON with status code 500', async () => {
    const { basePath } = setup();
    jest
      .spyOn(notesBLL, 'readAll')
      .mockRejectedValue(new Error('random error'));

    const response = await request.get(`${basePath}/notes`);
    const { status, headers, body } = response;

    expect(status).toBe(500);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Server Error' });
  });
});

describe('GET /notes/:noteId', () => {
  test('When request a note by id, then should return the note as a JSON with status code 200', async () => {
    const { createDocument, basePath, dummyNote } = setup();
    const { _id } = await createDocument(dummyNote);
    const noteId = _id.toString();

    const response = await request.get(`${basePath}/notes/${noteId}`);
    const { status, headers, body } = response;

    expect(status).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      isDone: expect.any(Boolean),
      createdAt: expect.any(String),
    });
    expect(isValidDate(body.createdAt)).toBeTruthy();
  });

  test('When request with not valid "noteId", then should return a bad request message as a JSON with status code 400', async () => {
    const { basePath } = setup();

    const response = await request.get(`${basePath}/notes/640e97d32bf39abc3af_not_valid_id`);
    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Unexpected value(s): \'noteId\' should be a valid ID' });
  });

  test('When request a note that not exists, then should return a not found resource message as a JSON with status code 404', async () => {
    const { basePath } = setup();

    const response = await request.get(`${basePath}/notes/640e97d32bf39abc3af74848`);
    const { status, headers, body } = response;

    expect(status).toBe(404);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Not Found, note ID not match' });
  });

  test('When unhandled error occurs, then should return server error message as a JSON with status code 500', async () => {
    const { basePath } = setup();
    jest
      .spyOn(notesBLL, 'readById')
      .mockRejectedValue(new Error('random error'));

    const response = await request.get(`${basePath}/notes/640e97d32bf39abc3af74848`);
    const { status, headers, body } = response;

    expect(status).toBe(500);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Server Error' });
  });
});

describe('PATCH /notes/:noteId', () => {
  test('When updates a note by id, then should return the new note record as a JSON with status code 200', async () => {
    const { createDocument, basePath, dummyNote, dummyNoteUpdate } = setup();
    const { _id } = await createDocument(dummyNote);
    const noteId = _id.toString();

    const response = await request
      .patch(`${basePath}/notes/${noteId}`)
      .send(dummyNoteUpdate);

    const { status, headers, body } = response;

    expect(status).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({
      id: expect.any(String),
      content: dummyNoteUpdate.content,
      isDone: expect.any(Boolean),
      createdAt: expect.any(String)
    });
    expect(isValidDate(body.createdAt)).toBeTruthy();
  });

  test('When try to update with not valid "noteId", then should return a bad request message as a JSON with status code 400', async () => {
    const { basePath, dummyNoteUpdate } = setup();

    const response = await request
      .patch(`${basePath}/notes/640e97d32bf39abc3af_not_valid_id`)
      .send(dummyNoteUpdate);

    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Unexpected value(s): \'noteId\' should be a valid ID' });
  });

  test('When try to update a note that not exists, then should return a not found resource message as a JSON with status code 404', async () => {
    const { basePath, dummyNoteUpdate } = setup();

    const response = await request
      .patch(`${basePath}/notes/640e97d32bf39abc3af74848`)
      .send(dummyNoteUpdate);

    const { status, headers, body } = response;

    expect(status).toBe(404);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Not Found, note ID not match' });
  });

  test('When missing "content" field, then should return bad request message as a JSON with status code 400', async () => {
    const { basePath } = setup();
    const emptyRequestbody = {};

    const response = await request
      .patch(`${basePath}/notes/640e97d32bf39abc3af74848`)
      .send(emptyRequestbody);

    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Required key(s): \'content\'.' });
  });

  test('When "content" is too long (length > 100), then should return bad request message as a JSON with status code 400', async () => {
    const { basePath } = setup();
    const tooLongString = new Array(102).fill('s').join('');

    const response = await request
      .patch(`${basePath}/notes/640e97d32bf39abc3af74848`)
      .send({ content:  tooLongString });

    const { status, headers, body } = response;

    expect(status).toBe(400);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Unexpected value(s): \'content\' should have at most a hundred (100) letters.' });
  });

  test('When unhandled error occurs, then should return server error message as a JSON with status code 500', async () => {
    const { basePath, dummyNoteUpdate } = setup();
    jest
      .spyOn(notesBLL, 'updateById')
      .mockRejectedValue(new Error('random error'));

    const response = await request
      .patch(`${basePath}/notes/640e97d32bf39abc3af74848`)
      .send(dummyNoteUpdate);

    const { status, headers, body } = response;

    expect(status).toBe(500);
    expect(headers['content-type']).toContain('application/json');
    expect(body).toEqual({ message: 'Server Error' });
  });
});

describe('DELETE /notes/:noteId', () => {
  test.todo('When delete a note by id, then should return a successfull message as a JSON with status code 200');
  test.todo('When recieve not valid "noteId", then should return a bad request message as a JSON with status code 400');
  test.todo('When request a note that not exists, then should return a not found resource message as a JSON with status code 404');
  test.todo('When unhandled error occurs, then should return server error message as a JSON with status code 500');
});