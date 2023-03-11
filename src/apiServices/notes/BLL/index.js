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

module.exports = {
  create
}