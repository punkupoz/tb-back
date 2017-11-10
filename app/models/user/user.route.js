var express = require("express");
var router = express.Router();

var user = require('./user.controller');

router.post('/', user.create_pending_user);
router.post('/verify', user.create_user);

module.exports = router;