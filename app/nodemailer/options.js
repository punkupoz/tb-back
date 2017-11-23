exports.verify = function(req, email, key){
	return {
		from: 'palapunkupoz@gmail.com',
		to: email,
		subject: 'Verifying account',
		html: `
		<p>
		Link to verify your account: ${'https://tracebucks.herokuapp.com/user/verify/verify?key=' + key + '&email=' + email}
		</p>
		<p>This is for testing purpose only :3 email format is to be changed</p>
		<p>Kimi no (koe) key: ${key}</p>
		<br/>
		<p> Happy Shinobu :3 </p>
		<img src="https://appmedia.jp/wp-content/uploads/2017/08/9b6e9135627ef4fc16375e01e290ca49.jpg"/>
		`
	}
}

exports.password_change = function(req, email, key){
	return {
		from: 'palapunkupoz@gmail.com',
		to: email,
		subject: 'Verifying account',
		html: `
		</p>
		Your account ${email} password has been changed.
		</p>
		`
	}
}