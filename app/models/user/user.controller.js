var db = require('../../../db');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt');
var Promise = require("bluebird");

exports.create_pending_user = function(req, res, next) {
	var verifyKey = randomstring.generate(30);
	const query = 'SELECT email FROM "user" WHERE email = $1';
	db.get().query(query, [req.body.email])
	.then(result => {
		if(result.length !== 0) {
			console.log(result);
			throw new Error("Email already exists in user table");
		}
	})
	.then(() => {
		const query = 'INSERT INTO pending_user (email, last_name, first_name, verify_key) VALUES ($1, $2, $3, $4) RETURNING *';
		const values = [req.body.email, req.body.last_name, req.body.first_name, verifyKey];
		return db.get().query(query, values);
	})
	.then(result => {
		res.send({
			ok: true,
			data: result,
		});
	})
	.catch(e => {
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
		const queryGetPending = 'SELECT * FROM "pending_user" WHERE email = $1';
		const valuesGetPending = [req.query.email, req.query.key];
		return db.get().any(queryGetPending, valuesGetPending)
	})
	.then((result) => {
		if(result.length === 0) {
			throw new Error('key or email incorrect');
		}
		else{
			return result;
		}
	})
	.then(result => {
		return db.get().tx(t => {
			const queryInsertUser = 'INSERT INTO "user" (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *';
			const valuesInsertUser = [result[0].email, hash, result[0].first_name, result[0].last_name];
			const insertUser = db.get().one(queryInsertUser, valuesInsertUser);
			const queryDeletePending = 'DELETE FROM pending_user WHERE email = $1';
			const deletePendingUser = db.get().none(queryDeletePending, [req.query.email]);
			return t.batch([insertUser, deletePendingUser]);
		})
	})
	.then(result => {
		res.send({
			ok: true,
			message: 'User ' + result[0].email + ' has been verified'
		})
	})
	.catch(e => {
		console.log(e);
		res.send({
			ok: false,
			message: e.message
		});
	});
}

exports.login = function(req, res, next) {
	const query = 'SELECT * FROM "user" WHERE "email" = $1';
	const values = [req.body.email];
	var user = null;
	db.get().one(query, values)
	.then(result => {
		user = result;
		return bcrypt.compare(req.body.password, result.password);
	})
	.then((isMatch) => {
		if (!isMatch) {
			throw new Error('password mismatch');
		} else {
			res.send({
				ok: true,
				id: user.id,
				email: user.email
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