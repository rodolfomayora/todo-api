const router = require('express').Router();

router.get('/', (reques, response) => {
  return response
    .status(200)
    .json({ message: 'TODO RESTful API' });
});

module.exports = router;