var db = require('../../../db');
var randomstring = require('randomstring');

exports.create_pending_user = function(req, res, next) {

	//TODO
	//CHECK req

	var verifyKey = randomstring.generate(30);

	const query = 'INSERT INTO pending_user (email, last_name, first_name, verify_key) VALUES ($1, $2, $3, $4) RETURNING *';
	const values = [req.body.email, req.body.last_name, req.body.first_name, verifyKey];
	db.get().query(query, values)
	.then(result => {
		res.send(result.rows[0]);
	})
	.catch(e => {
		res.send({
			ok: false,
			error: e
		});
	});
}
   

    zxc   
exports.create_user = function (req, res, next) {
	const queryGetPending = 'SELECT * FROM "pending_user" WHERE email = $1 AND verify_key = $2';
	const valuesGetPending = [req.query.email, req.query.key];
	db.get().query(queryGetPending, valuesGetPending)
	.then(result => {
		if(result.rowCount !== 0) {
			const queryInsertUser = 'INSERT INTO "user" (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *';
			const valuesInsertUser = [result.rows[0].email, req.body.password, result.rows[0].first_name, result.rows[0].last_name];
			db.get().query(queryInsertUser, valuesInsertUser)
			.then(result2 => {
				res.send(result2);
			})
			.catch(e => {
				res.send({
					ok:false,
					message: 'error when inserting new user',
					error: e
				})
			})
		} else {
			res.send({
				ok: false,
				message: 'key or email incorrect'
			})
		}
	})
	.catch(e => {
		res.send({
			ok:false,
			message: 'error when finding pending user',
			error: e
		})
	})
}