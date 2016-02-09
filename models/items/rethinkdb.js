
/*------
Model Items (rethinkdb)
------------*/

module.exports = function() {

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

		addUnixCreated: function(args) {
			args = args || {};
			var now = new Date().getTime();
			var unixCreated = now / 1000;
			args.unixCreated = unixCreated;
			return args;
		},

		connect: function(connected) {
			r.connect({
				host: process.env.RETHINKDB_HOST,
				port: process.env.RETHINKDB_PORT,
				db: process.env.RETHINKDB_DB
			}, function(err, connection) {
				if (err) { throw err; }
				connected(connection);
			});
		},

		safelist: function(item) { 
			var item = _.omit(item, []);
			return _.isEmpty(item) ? null : item;
		},

		whitelist: function(item) {
			var item = _.pick(item, [ 'id', 'name', 'description' ]);
			return _.isEmpty(item) ? null : item;
		}

	};

	/*------
	Defining Model
	------------*/

	var model = {

		_init: function() {
			helpers.connect(function(connection) {
				r.dbCreate('app').run(connection, function(err, result) {
					r.db('app').table('items').run(connection, function(err, result) {
						if (err) { 
							r.db('app').tableCreate('items').run(connection, function(err, result) { });
						}
					});
				})
			});
		},

		create: function(userId, args, callback) {
			helpers.connect(function(connection) {
				args = helpers.whitelist(args);
				args = helpers.addUnixCreated(args);
				args.userId = userId;
				r.table('items')
					.insert(args, { returnChanges: 'always', conflict: 'update' })
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						var item = {};
						if (result.changes) {
							if (result.changes[0]) {
								item = result.changes[0].new_val;
							}
						}
						return callback(item ? 200 : 204, item);
					});
			});
		},

		delete: function(userId, id, callback) {
			helpers.connect(function(connection) {
				r.table('items')
					.filter({ id: id, userId: userId })
					.delete()
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						return callback(204, {});	
					});
			});
		},

		getById: function(userId, id, callback) {
			helpers.connect(function(connection) {
				r.table('items')
					.filter({ id: id, userId: userId })
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }

						var item = helpers.safelist(result);
						if (!item) { return callback(404, null); }
						return callback(200, item);
					});
			});
		},

		getAll: function(userId, callback) {
			helpers.connect(function(connection) {
				r.table('items')
					.filter({ userId: userId })
					.run(connection, function(err, cursor) {
						if (err) { return callback(500, null, err); }

						cursor.toArray(function(err, result) {
							if (err) { return callback(500, null, err); }

							var items = _.map(result, function(item) {
								return helpers.safelist(item);
							});

							if (!items) { return callback(404, null); }
							return callback(200, items);
						});
					});
			});
		},

		update: function(userId, id, args, callback) {
			helpers.connect(function(connection) {
				args = helpers.whitelist(args);	
				if (!args) { return callback(400, null); }
				r.table('items')
					.filter({ id: id, userId: userId })
					.update(args, { returnChanges: 'always' })
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						var item = {};
						if (result.changes) {
							if (result.changes[0]) {
								item = result.changes[0].new_val;
							}
						}
						return callback(item ? 200 : 204, item);
					});
			});
		}

	};

	/*------
	Returning Model
	------------*/

	return model;

};
