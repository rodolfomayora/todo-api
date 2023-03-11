const router = require('express').Router();
const notesController = require('./controller');

router.post('/', notesController.create);
router.get('/', notesController.readAll);
router.get('/:noteId', notesController.readById);

module.exports = router;