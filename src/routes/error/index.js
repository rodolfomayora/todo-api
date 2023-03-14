const router = require('express').Router();
const env = require('../../config/env');

if (!env.IS_PRODUCTION) {
  router.get('/error', (request, response, next) => {
    try {
      throw new Error('random error');
    } catch (error) {
      next(error);
    }
  });
}

module.exports = router;