const mongoose = require('mongoose');
const errorCodes = require('../../../util/errorCodes');
const Note = require('./model/Note');

const { CastError } = mongoose.Error;

const create = async (noteData) => {
  const { content } = noteData;
  const newNote = { content };
  const response = await Note.create(newNote);
  const document = response.toObject();
  return { ...document };
}

const readAll = async (query) => {
  const { limit } = query;
  const defultLimit = 10;
  const documents = await Note
    .find()
    .sort({ createdAt: 'descending' })
    .limit(limit ?? defultLimit)
    .lean();

  return [...documents];
}

const readById = async (noteId) => {
  try {
    const document = await Note.findById(noteId).lean();
    const documentNotFound = !document;
    if (documentNotFound) {
      const handledError = new Error('Not Found, note ID not match');
      handledError.code = errorCodes.NOT_FOUND;
      throw handledError;
    }
    return { ...document };

  } catch (error) {
    const isCastError = error instanceof CastError;
    if (isCastError) {
      const handledError = new Error('Unexpected value(s): \'noteId\' should be a valid ID');
      handledError.code = errorCodes.BAD_REQUEST;
      handledError.stack = error.stack;
      throw handledError;
    }
    throw error;
  }
}

const updateById = async (noteId, noteData) => {
  const updatedData = { ...noteData }
  const config = { new: true }; // return updated document
  try {
    const document = await Note
      .findByIdAndUpdate(noteId, updatedData, config)
      .lean();

    const documentNotFound = !document;
    if (documentNotFound) {
      const handledError = new Error('Not Found, note ID not match');
      handledError.code = errorCodes.NOT_FOUND;
      throw handledError;
    }
    return { ...document };

  } catch (error) {
    const isCastError = error instanceof CastError;
    if (isCastError) {
      const handledError = new Error('Unexpected value(s): \'noteId\' should be a valid ID');
      handledError.code = errorCodes.BAD_REQUEST;
      handledError.stack = error.stack;
      throw handledError;
    }
    throw error;
  }
}

const deleteById = async (noteId) => {
  try {
    const document = await Note.findByIdAndDelete(noteId);
    const documentNotFound = !document;
    // if (documentNotFound) {
    //   const handledError = new Error('Not Found, note ID not match');
    //   handledError.code = errorCodes.NOT_FOUND;
    //   throw handledError;
    // }
    return;

  } catch (error) {
    // const isCastError = error instanceof CastError;
    // if (isCastError) {
    //   const handledError = new Error('Unexpected value(s): \'noteId\' should be a valid ID');
    //   handledError.code = errorCodes.BAD_REQUEST;
    //   handledError.stack = error.stack;
    //   throw handledError;
    // }
    throw error;
  }
}

module.exports = {
  create,
  readAll,
  readById,
  updateById,
  deleteById
}