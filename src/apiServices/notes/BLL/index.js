const notesDAL = require('../DAL');

const create = async (body) => {
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
  const rawNotes = await notesDAL.readAll(query);
  const normalizedNotes = rawNotes.map((rawNote) => {
    const { _id, content, isDone, createdAt } = rawNote;
    return {
      id: _id.toString(),
      content,
      isDone,
      createdAt
    }
  })
  return normalizedNotes;
}

module.exports = {
  create,
  readAll
}