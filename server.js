'usr strict'

//Dependencies
var express = require('express');
var bodyParser = require('body-parser');


var app = express();
var cors = require('cors');
var helmet = require('helmet');
require('dotenv').config();


//Port
var port = process.env.PORT || 3001;

//Database

var db = require('./db');
app.use(cors());
app.use(helmet());


db.connect('heroku', function(err) {
	if (err) {
		console.log('Unable to connect to database ');
		process.exit(1)
	} else {
		app.listen(port, function() {
			console.log(`api running on port ${port}`);
		});
	}
});

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//API ROUTES
var apiRoutes = express.Router(); 

apiRoutes.use('/user', require('./app/models/user/user.route'));

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

module.exports = app;