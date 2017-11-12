var express = require("express");
var router = express.Router();

var user = require('./user.controller');

router.post('/register', user.create_pending_user);
router.post('/verify', user.create_user);
router.post('/login', user.login);

module.exports = router;