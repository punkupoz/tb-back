const db = require('../../../db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const Promise = require("bluebird");
const options = require('../../nodemailer/options');
const transporter = require('../../nodemailer/transporter');
const jwt = require('jsonwebtoken');

exports.create_pending_user = function(req, res, next) {
	var verifyKey = randomstring.generate(5);
	const query = 'SELECT address FROM "user_email" WHERE address = $1';
	db.get().query(query, [req.body.email])
	.then(result => {
		if(result.length !== 0) {
			console.log(result);
			throw new Error("Email already exists");
		}
	})
	.then(() => {
		const query = 'INSERT INTO pending_user (email, last_name, first_name, verify_key) VALUES ($1, $2, $3, $4) RETURNING *';
		const values = [req.body.email, req.body.last_name, req.body.first_name, verifyKey];
		return db.get().query(query, values);
	})
	.then(result => {
		transporter.send(options.verify(req, req.body.email, verifyKey));
		res.send({
			ok: true,
			message: 'Pending user ' + req.body.first_name + ' ' + req.body.last_name + ' has been created'
		});
	})
	.catch(e => {
		console.log(e);
		res.send({
			ok:false,
			error: e.message
		});
	});
}

exports.create_user = function (req, res, next) {
	var hash;
	function havePassword(pass){
		return new Promise((resolve, reject) => {
			if(!pass) {
				throw new Error('no password provided');
			} else {
				resolve('ok');
			}
		});
	}

	havePassword(req.body.password)
	.then(() => {
		return bcrypt.hash(req.body.password, 8)
	})
	.then(hashed => {
		hash = hashed;
	})
	.then(() => {
		const queryGetPending = 'SELECT * FROM "pending_user" WHERE email = $1 AND verify_key=$2';
		const valuesGetPending = [req.query.email, req.query.key];
		return db.get().oneOrNone(queryGetPending, valuesGetPending)
	})
	.then((result) => {
		if(!result) {
			throw new Error('Key or email incorrect');
		}
		else{
			return result;
		}
	})
	.then(result => {
		return db.get().one('SELECT * FROM new_user($1, $2, $3, $4)', [result.first_name, result.last_name, result.email, hash]);
	})
	.then(result => {
		res.send({
			ok: true,
			message: 'User ' + result.fn + ' ' + result.ln + ' has been verified'
		})
	})
	.catch(e => {
		console.log(e);
		res.send({
			ok: false,
			error: e.message
		});
	});
}

exports.login = function(req, res, next) {
	const query = 'SELECT * FROM "user_email" WHERE "address" = $1';
	const values = [req.body.email];
	var user = null;
	db.get().oneOrNone(query, values)
	.then(result => {
		if(!result) {
			throw new Error('Email or password incorrect')
		}
		return db.get().one('SELECT * FROM "user" WHERE id = $1', [result.user_id]);
	})
	.then(result => {
		user = result;
		return bcrypt.compare(req.body.password, result.password);
	})
	.then((isMatch) => {
		if (!isMatch) {
			throw new Error('Email or password incorrect');
		} else {
			var token = jwt.sign({
				id: user.id,
				email: user.email
			}, process.env.SECRET_KEY, {
				expiresIn: 86400
			});
			res.send({
				ok: true,
				token: token
			})
		}
	})
	.catch(e => {
		console.log(e);
		res.send({
			ok: false,
			error: e.message
		});
	});
}

exports.change_password = function(req, res, next) {
	var user = null;
	var hash = null;
	function havePassword(newPass, oldPass){
		return new Promise((resolve, reject) => {
			if(!oldPass || !newPass) {
				throw new Error('old or new password were not set');
			} else {
				resolve('ok');
			}
		});
	}

	havePassword(req.body.new_password, req.body.password)
	.then(() => {
		return db.get().oneOrNone('SELECT user_id FROM user_email WHERE email = $1', [req.decoded.email]);
	})
	.then(result => {
			return db.get().one('SELECT password FROM "user" WHERE id = $1', [result.user_id]);
	})
	.then(result => {
		user = result;
		return bcrypt.compare(req.body.password, result.password);
	})
	.then(isMatch => {
		if (!isMatch) {
			throw new Error('Email or password incorrect');
		}
	})
	.then(() => {
		return bcrypt.hash(req.body.new_password, 8)
	})
	.then(hashed => {
		hash = hashed;
	})
	.then(result => {
		return db.get().one('UPDATE "user" SET password = $1 WHERE email = $2 RETURNING *', [hash, user[0].email])
	})
	.then(result => {
		transporter.send(options.password_change(req, user[0].email, null));
		res.send({
			ok: true,
			message: 'Password updated'
		})
	})
	.catch(e => {
		console.log(e);
		res.send({
			ok:false,
			error: e.message
		})
	})
}

//input: user email
//output: email and verify key

// exports.resend_email = function(req, res, next) {
// 	var email;
// 	db.get().one('SELECT id FROM "user_email" WHERE address = $1', [req.body.email]).
// 	.then(result => {

// 	})
// 	.then(result => {
// 		transporter.send(options.verify(req, result.email, result.verify_key));
// 	})
// 	.catch(e => {
// 		res.send({
// 			ok: false,
// 			error: e
// 		})
// 	})
// }

// exports.change_email = function()