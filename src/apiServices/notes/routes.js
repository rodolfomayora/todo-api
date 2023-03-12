const router = require('express').Router();
const notesController = require('./controller');

router.post('/', notesController.create);
router.get('/', notesController.readAll);
router.get('/:noteId', notesController.readById);
router.patch('/:noteId', notesController.updateById);
router.delete('/:noteId', notesController.deleteById);

module.exports = router;