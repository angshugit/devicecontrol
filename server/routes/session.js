var express = require('express');
var router = express.Router();

var session_controller = require('../controllers/sessioncontroller');

// GET could get the login page

// POST request for login
router.post('/', session_controller.session_login_on_post);

// DELETE request for logout
router.delete('/:id', session_controller.session_logout_on_delete);

module.exports = router
