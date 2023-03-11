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

module.exports = {
  create
}