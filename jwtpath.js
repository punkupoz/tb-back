var jwt = require('jsonwebtoken');

const notRequired = ['/api/user/register', '/api/user/verify', '/api/user/login', '/api/user/resendemail', '/api/user/forgot'];

exports.prohibited = function(req, res, next) {
	for (var i = 0; i < notRequired.length; i++) {
		if(req.path === notRequired[i]) {
			return next();
		}
	}
	
	// check header or url parameters or post parameters for token
	var token = req.headers['x-access-token'];
	// decode token
	if(token) {
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			if(err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			}
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		})
	}
	else {
		 // if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			error: 'No token provided.' 
		});
	}
}