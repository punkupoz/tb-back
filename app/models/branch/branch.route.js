var express = require("express");
var router = express.Router();

var bank = require('./bank.controller');

router.get('/getbankinfo', bank.get_info);


module.exports = router;