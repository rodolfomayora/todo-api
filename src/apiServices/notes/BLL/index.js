const mongoose = require('mongoose');
const errorCodes = require('../../../util/errorCodes');
const notesDAL = require('../DAL');

const create = async (body) => {
  const isContentNotDefined = !body?.content;
  if (isContentNotDefined) {
    const error = new Error('Required key(s): \'content\'.');
    error.code = errorCodes.BAD_REQUEST;
    throw error;
  }

  const noteContent = body.content.trim().toLowerCase();

  const isTooLong = noteContent.length > 100;
  if (isTooLong) {
    const error = new Error('Unexpected value(s): \'content\' should have at most a hundred (100) letters.')
    error.code = errorCodes.BAD_REQUEST;
    throw error;
  }

  const noteData = {
    content: noteContent
  };

  const rawData = await notesDAL.create(noteData);
  const { _id, content, isDone, createdAt } = rawData;
  return {
    id: _id.toString(),
    content,
    isDone,
    createdAt
  };
}

const readAll = async (query) => {
  if ('limit' in query) {
    const queryLimit = Number(query.limit);
    const isInteger = Number.isInteger(queryLimit);

    if (!isInteger) {
      const error = new Error('Unexpected value(s): \'limit\' should be an integer number.');
      error.code = errorCodes.BAD_REQUEST;
      throw error;
    }
  }

  const rawDataList = await notesDAL.readAll(query);
  const normalizedNotes = rawDataList.map((rawData) => {
    const { _id, content, isDone, createdAt } = rawData;
    return {
      id: _id.toString(),
      content,
      isDone,
      createdAt
    }
  })
  return [...normalizedNotes];
}

const readById = async (params) => {
  const { noteId } = params;
  const rawData = await notesDAL.readById(noteId);
  const { _id, content, isDone, createdAt } = rawData;
  return {
    id: _id.toString(),
    content,
    isDone,
    createdAt
  };
}

const updateById = async (params, body) => {
  const { noteId } = params;
  const noteData =  { ...body };
  const rawData = await notesDAL.updateById(noteId, noteData);
  const { _id, content, isDone, createdAt } = rawData;
  return {
    id: _id.toString(),
    content,
    isDone,
    createdAt
  };
}

const deleteById = async (params) => {
  const { noteId } = params;
  await notesDAL.deleteById(noteId);
  return { message: 'Resource deleted successfully' };
}

module.exports = {
  create,
  readAll,
  readById,
  updateById,
  deleteById
}