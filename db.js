var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

var state = {
	cn: null
}

exports.connect = function(mode, done) {
	if(mode == "heroku"){
		state.cn = pgp({
			connectionString: process.env.DATABASE_URL
		});
	}
	if(mode == "localhost") {
		state.cn = pgp({
			user: 'postgres',
			host: '127.0.0.1',
			database: 'test',
			password: 'dafuqdude11',
			port: 5432,
		});
	}
	done();
}

exports.get = function() {
	// console.log(state.cn);
	return state.cn;
}
