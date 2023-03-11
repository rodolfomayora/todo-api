const mongoose = require('mongoose');
const errorCodes = require('../../../util/errorCodes');
const Note = require('./model/Note');

const { CastError } = mongoose.Error;

const create = async (noteData) => {
  const { content } = noteData;
  const newNote = { content };
  const document = await Note.create(newNote);
  const rawData = document.toObject();
  return { ...rawData };
}

const readAll = async (query) => {
  const { limit } = query;
  const defultLimit = 10;
  const rawDataList = await Note
    .find()
    .sort({ createdAt: 'descending' })
    .limit(limit ?? defultLimit)
    .lean();

  return [...rawDataList];
}

const readById = async (noteId) => {
  try {
    const document = await Note.findById(noteId).lean();
    const isNotFound = !document;
    if (isNotFound) {
      const handledError = new Error('Not Found, note ID not match');
      handledError.code = errorCodes.NOT_FOUND;
      throw handledError;
    }
    return { ...document };

  } catch (error) {
    const isCastError = error instanceof CastError;
    if (isCastError) {
      const handledError = new Error('Not valid note ID value');
      handledError.code = errorCodes.BAD_REQUEST;
      handledError.stack = error.stack;
      throw handledError;
    }
    throw error;
  }
}

// const updateById = async (noteId, body) => {}

const deleteById = async (noteId) => {
  try {
    const document = await Note.findByIdAndDelete(noteId);
    const isNotFound = !document;
    if (isNotFound) {
      const handledError = new Error('Not Found, note ID not match');
      handledError.code = errorCodes.NOT_FOUND;
      throw handledError;
    }
    return;

  } catch (error) {
    const isCastError = error instanceof CastError;
    if (isCastError) {
      const handledError = new Error('Not valid note ID value');
      handledError.code = errorCodes.BAD_REQUEST;
      handledError.stack = error.stack;
      throw handledError;
    }
    throw error;
  }
}

module.exports = {
  create,
  readAll,
  readById,
  deleteById
}