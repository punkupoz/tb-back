const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'palapunkupoz@gmail.com',
		pass: 'dafuqdude11'
	}
});

exports.send = option => {
	transporter.sendMail(option, (err, info) =>{
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
}