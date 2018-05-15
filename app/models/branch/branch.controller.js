const db = require('../../../db');

exports.get = function(req, res, next) {
	db.get().query('SELECT * FROM bank WHERE bsb = $1', [req.body.bsb])
	.then(result => 
		res.send({
			ok:true,
			message: "",
			data: result
		})
	)
	.catch(e => {
		res.send({
			ok: false,
			error: e.message
		})
	})
}