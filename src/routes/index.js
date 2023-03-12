const router = require('express').Router();

router.use('/notes', require('../apiServices/notes/routes'));
router.use(require('./error')); // GET /error
router.use(require('./root')); // GET /

module.exports = router;