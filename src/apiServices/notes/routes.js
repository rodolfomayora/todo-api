const router = require('express').Router();
const notesController = require('./controller');

router.post('/', notesController.create);

module.exports = router;