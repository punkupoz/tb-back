const { Pool, Client } = require('pg');

var state = {
	pool: null
}

exports.connect = function(mode, done) {
	state.pool = new Pool({
		user: 'postgres',
		host: '127.0.0.1',
		database: 'test',
		password: 'dafuqdude11',
		port: 5432,
	});
	done();
}

exports.get = function() {
	return state.pool;
}