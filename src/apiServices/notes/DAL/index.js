// const errorCodes = require('../../../util/errorCodes');
const Note = require('./model/Note');

const create = async (noteData) => {
  const { content } = noteData;
  const newNote = { content };
  const response = await Note.create(newNote);
  const rawData = response.toObject();
  return { ...rawData };
}

// const readAll = async (query) => {}
// const readAll = async () => {}

// const readById = async (noteId) => {}

// const updateById = async (noteId, body) => {}

// const deleteById = async (noteId) => {}

module.exports = {
  create
}