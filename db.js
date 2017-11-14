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
			connectionString: "postgres://wdjkdcmfjuuoln:645185c40838d2012477d6b1bb7a5a65d4e4c00284d0af7fc8c4e125ad377983@ec2-54-163-255-181.compute-1.amazonaws.com:5432/df5kgm4cigv6fh"
		});
	}
	if(mode == "localhost") {
		state.cn = pgp({
			user: 'postgres',
			host: 'localhost',
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
