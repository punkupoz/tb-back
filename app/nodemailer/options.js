exports.verify = function(req, email, key){
	return {
		from: 'palapunkupoz@gmail.com',
		to: email,
		subject: 'Verifying account',
		html: `
		</p>
		Link to verify your account: ${req.protocol + '://' + req.get('host') + '/user/verify/verify?key=' + key + '&email=' + email}
		</p>
		`
	}
}