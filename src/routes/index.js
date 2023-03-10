const router = require('express').Router();

router.use('/notes', require('../apiServices/notes/routes'));
router.get('/', (reques, response) => response
  .status(200)
  .json({ message: 'TODO RESTful API' })
);

module.exports = router;