const handledError = Object.freeze({ // freeze to avoid key/value mutations
  UNAUTHORIZED: 'UNAUTHORIZED', // Authentication failed or user does not have permissions
  UNKNOWN_ROUTE: 'UNKNOWN_ROUTE',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND'
});

module.exports = handledError;