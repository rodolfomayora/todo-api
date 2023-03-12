const router = require('express').Router();

router.get('/', (request, response) => response
    .status(200)
    .json({ message: 'TODO RESTful API' }
));

module.exports = router;