var db = require('../../../db');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt');

exports.create_pending_user = function(req, res, next) {

	var verifyKey = randomstring.generate(30);

	const query = 'SELECT email FROM "user" WHERE email = $1';
	db.get().query(query, [req.body.email])
	.then(result => {
		if(result.rowCount !== 0) {
			throw new Error("Email already exists in user table");
		}
	}).then(() => {
		const query = 'INSERT INTO pending_user (email, last_name, first_name, verify_key) VALUES ($1, $2, $3, $4) RETURNING *';
		const values = [req.body.email, req.body.last_name, req.body.first_name, verifyKey];
		db.get().query(query, values)
		.then(result => {
			res.send({
				ok: true,
				data: result.rows[0],
			});
		})
		.catch(e => {
			res.send({
				ok: false,
				error: e
			});
		});
	}).catch(e => {
		res.send({
			ok:false,
			error: e.message
		});
	});
}

exports.create_user = function (req, res, next) {
	bcrypt.hash(req.body.password, 8)
	.then((hash)=>{
		db.get().query(queryGetPending, valuesGetPending)
		.then(result => {
			if(result.rowCount === 0) {
				throw new Error('key or email incorrect');
			}
			else {
				const queryInsertUser = 'INSERT INTO "user" (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *';
				const valuesInsertUser = [result.rows[0].email, hash, result.rows[0].first_name, result.rows[0].last_name];
				db.get().query(queryInsertUser, valuesInsertUser)
				.then(result2 => {
					res.send({
						ok: true,
						data:result2
					});
				})
				.catch(e => {
					res.send({
						ok:false,
						message: 'error when inserting new user',
						error: e.message
					})
				})
			}
		})
		.then(() => {
			const queryDeletePending = 'DELETE FROM pending_user WHERE email = $1';
			db.get().query(queryDeletePending, [req.query.email])
			.catch(e => {
				console.log(e);
			});
		})
		.catch(e => {
			res.send({
				ok:false,
				error: e.message
			})
		})
	})
	.catch(e => {
		res.send({
			ok: false,
			error: e.message
		});
	});

	const queryGetPending = 'SELECT * FROM "pending_user" WHERE email = $1 AND verify_key = $2';
	const valuesGetPending = [req.query.email, req.query.key];
	
}

exports.login = function(req, res, next) {
	const query = 'SELECT * FROM "user" WHERE "email" = $1';
	const values = [req.body.email];
	db.get().query(query, values)
	.then(result => {	
		bcrypt.compare(req.body.password, result.rows[0].password)
		.then((isMatch) => {
			if (!isMatch) {
				throw new Error('password mismatch');
			} else {
				res.send({
					ok: true,
					id: result.rows[0].id,
					email: result.rows[0].email
				})
			}
		})
		.catch(e => {
			res.send({
				ok:false,
				error: e.message
			})
		});
	})
	.catch(e => {
		res.send({
			ok: false,
			error: e.message
		});
	});
}