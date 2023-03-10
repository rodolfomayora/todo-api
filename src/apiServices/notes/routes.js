const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.getnotes);

module.exports = router;