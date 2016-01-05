
/*------
Model Users (rethinkdb)
------------*/

module.exports = function(config) {

	/*------
	Dependencies
	------------*/

	var r = require('rethinkdb');
	var crypto = require('crypto');
	var _ = require('underscore');

	/*------
	Helpers
	------------*/

	var helpers = {

		changeprimary: function(user) {
			user.user_id = user.id;
			delete user.id;
			return user;
		},

		connect: function(connected) {
			r.connect({
				host: config.RETHINKDB_HOST,
				port: config.RETHINKDB_PORT,
				db: config.RETHINKDB_DB
			}, function(err, connection) {
				if (err) { throw err; }
				connected(connection);
			});
		},

		hash: function(str) {
			return crypto.createHash('md5')
				.update(str + config.APP_SALT)
				.digest('hex');
		},
		
		randomstring: function() {
			return crypto.randomBytes(20).toString('hex');
		},

		safelist: function(user) { 
			var user = _.omit(user, ['user_password', 'user_token']);
			return _.isEmpty(user) ? null : user;
		},

		whitelist: function(user) {
			var user = _.pick(user, [ 'user_id', 'user_username', 'user_password', 'user_token', 'user_email' ]);
			return _.isEmpty(user) ? null : user;
		}

	};

	/*------
	Defining Model
	------------*/

	var model = {

		_init: function() {
			helpers.connect(function(connection) {
				r.dbCreate('app').run(connection, function(err, result) {
					r.db('app').table('users').run(connection, function(err, result) {
						if (err) { 
							r.db('app').tableCreate('users').run(connection, function(err, result) { });
						}
					});
				})
			});
		},

		assignTokenToUser: function(userId, callback) {
			helpers.connect(function(connection) {
				var user_token = helpers.randomstring();
				r.table('users')
					.get(userId)
					.update({ user_token: user_token })
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						return callback(200, { user_token: user_token });
					});
			});
		},

		createWithUsernameAndPassword: function(userUsername, userPassword, callback) {
			helpers.connect(function(connection) {
				r.table('users')
					.insert({ 
						user_username: userUsername, 
						user_password: helpers.hash(userPassword) 
					})
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						return callback(200, { user_username: userUsername });
					});
			});
		},

		delete: function(userId, callback) {
			helpers.connect(function(connection) {
				r.table('users')
					.get(userId)
					.delete()
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						return callback(204, {});	
					});
			});
		},

		getByToken: function(userToken, callback) {
			helpers.connect(function(connection) {
				r.table('users')
					.filter({ user_token: userToken })
					.run(connection, function(err, cursor) {
						if (err) { return callback(500, null, err); }

						cursor.toArray(function(err, result) {
							if (err) { return callback(500, null, err); }

							var user = result[0];
							user = helpers.changeprimary(user);
							user = helpers.safelist(user);
							if (!user) { return callback(404, null); }
							return callback(200, user);
						});
					});
			});
		},

		getByUsername: function(userUsername, callback) {
			helpers.connect(function(connection) {
				r.table('users')
					.filter({ user_username: userUsername })
					.run(connection, function(err, cursor) {
						if (err) { return callback(500, null, err); }

						cursor.toArray(function(err, result) {
							if (err) { return callback(500, null, err); }

							var user = result[0];
							user = helpers.changeprimary(user);
							user = helpers.safelist(user);
							if (!user) { return callback(404, null); }
							return callback(200, user);
						});
					});
			});
		},

		getByUsernameAndPassword: function(userUsername, userPassword, callback) {
			helpers.connect(function(connection) {
				r.table('users')
					.filter({ 
						user_username: userUsername, 
						user_password: helpers.hash(userPassword) 
					})
					.run(connection, function(err, cursor) {
						if (err) { return callback(500, null, err); }

						cursor.toArray(function(err, result) { 
							if (err) { return callback(500, null, err); }

							var user = result[0];
							user = helpers.changeprimary(user);
							user = helpers.safelist(user);
							if (!user) { return callback(404, null); }
							return callback(200, user);							
						});
					});
			});
		},

		update: function(userId, userArgs, callback) {
			helpers.connect(function(connection) {

				//Make sure we're not overwriting our user_token on user info update
				userArgs = _.omit(userArgs, ['user_token']);

				var userArgs = helpers.changeprimary(userArgs);
				userArgs = helpers.whitelist(userArgs);	

				if (!userArgs) { return callback(400, null); }

				//If user_password has been passed, we make sure to hash our value
				if (userArgs.user_password) { userArgs.user_password = helpers.hash(userArgs.user_password); }

				r.table('users')
					.get(userId)
					.update(userArgs)
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						var user = helpers.safelist(userArgs);
						return callback(200, user);
					});
			});
		}

	};

	/*------
	Returning Model
	------------*/

	return model;

};
