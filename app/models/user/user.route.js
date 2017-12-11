var express = require("express");
var router = express.Router();

var user = require('./user.controller');

router.post('/register', user.create_pending_user);
router.post('/verify', user.create_user);
router.post('/login', user.login);
router.post('/changepassword', user.change_password);
router.post('/resendemail', user.resend_email);
router.post('/forgot', user.forgot_password);
router.get('/getuserinfo', user.get_info);

router.get('/clear', user.deleteall);

module.exports = router;