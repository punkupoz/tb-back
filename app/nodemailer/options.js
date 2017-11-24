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
		<p style="margin: 3rem 0">Kimi no (koe) key: ${key}</p>
		<br/>
		<p> Panaino :3</p>
		<img src="https://pa1.narvii.com/6077/1834ab152f446f537cfb4541cf047f70b6816431_hq.gif"/>
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