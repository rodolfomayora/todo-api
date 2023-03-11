const notesBLL = require('../BLL');

const create = async (request, response, next) => {
  const { body } = request;
  try {
    const payload = await notesBLL.create(body);
    return response.status(201).json({ ...payload });

  } catch (error) {
    return next(error);
  }
}

const readAll = async (request, response, next) => {
  const { query } = request;
  try {
    const payload = await notesBLL.readAll(query);
    return response.status(200).json([...payload]);

  } catch (error) {
    return next(error);
  }
}

const readById = async (request, response, next) => {
  const { params } = request;
  try {
    const payload = await notesBLL.readById(params);
    return response.status(200).json({ ...payload });

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  readAll,
  readById
}