const errorCodes = require('../../../util/errorCodes');
const notesDAL = require('../DAL');

const create = async (body) => {
  // todo: validate body
  const isContentNotDefined = !body?.content;
  if (isContentNotDefined) {
    const error = new Error('Required key(s): content');
    error.code = errorCodes.BAD_REQUEST;
    throw error;
  }

  const noteData = { ...body };
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
  // todo: validate query
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
  // todo: validate param exists
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
  // todo: validate params and body
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
  // todo: validate param exists
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