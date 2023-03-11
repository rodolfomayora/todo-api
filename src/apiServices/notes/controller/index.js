const getnotes = (request, response, next) => {
  try {

    return response.status(200).json({ message: 'NOTES' });

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getnotes
}