const isValidDate = (dateString) => {
  return !isNaN(Date.parse(dateString));
}

module.exports = isValidDate;