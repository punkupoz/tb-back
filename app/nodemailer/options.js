exports.verify = function(req, email, key){
	return {
		from: 'palapunkupoz@gmail.com',
		to: email,
		subject: 'Verifying account',
		html: `
		<a	href="${'https://tracebucks.herokuapp.com/user/verify/verify?key=' + key + '&email=' + email}"
				style="
					display: inline-block;
					margin-bottom: 0;
					font-weight: 400;
					text-align: center;
					vertical-align: middle;
					touch-action: manipulation;
					cursor: pointer;
					background-image: none;
					border: 1px solid transparent;
					white-space: nowrap;
					padding: 6px 12px;
					font-size: 14px;
					line-height: 1.42857143;
					border-radius: 4px;
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
				
					color: #fff;
					background-color: #5cb85c;
					border-color: #4cae4c;
					text-decoration: none;"
				>
				Verify your account
			</a>
		<p style="margin: 3rem 0">Or use this key: ${key}</p>
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

exports.forgot_password = function(req, email, password){
	return {
		from: 'palapunkupoz@gmail.com',
		to: email,
		subject: 'Your new fucking password is here',
		html: `
		</p>
		Your account ${email} password is ${password}.
		</p>
		`
	}
}