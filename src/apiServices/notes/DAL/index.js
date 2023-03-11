// const errorCodes = require('../../../util/errorCodes');
const Note = require('./model/Note');

const create = async (noteData) => {
  const { content } = noteData;
  const newNote = { content };
  const response = await Note.create(newNote);
  const rawData = response.toObject();
  return rawData;
}

const readAll = async (query) => {
  const { limit } = query;
  const defultLimit = 10;
  const rawNotes = await Note
    .find()
    .sort({ createdAt: 'descending' })
    .limit(limit ?? defultLimit)
    .lean();

  return rawNotes;
}

// const readById = async (noteId) => {}

// const updateById = async (noteId, body) => {}

// const deleteById = async (noteId) => {}

module.exports = {
  create,
  readAll,
}