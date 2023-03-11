const router = require('express').Router();
const notesController = require('./controller');

router.post('/', notesController.create);
router.get('/', notesController.readAll);

module.exports = router;