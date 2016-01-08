
/*------
Model Items (rethinkdb)
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

		create: function(args, callback) {
			helpers.connect(function(connection) {
				args = helpers.whitelist(args);
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

		delete: function(id, callback) {
			helpers.connect(function(connection) {
				r.table('items')
					.get(id)
					.delete()
					.run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }
						return callback(204, {});	
					});
			});
		},

		getById: function(id, callback) {
			helpers.connect(function(connection) {
				r.table('items').get(id).run(connection, function(err, result) {
						if (err) { return callback(500, null, err); }

						var item = helpers.safelist(result);
						if (!item) { return callback(404, null); }
						return callback(200, item);
					});
			});
		},

		getAll: function(callback) {
			helpers.connect(function(connection) {
				r.table('items')
					// .filter()
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

		update: function(id, args, callback) {
			helpers.connect(function(connection) {
				args = helpers.whitelist(args);	
				if (!args) { return callback(400, null); }
				r.table('items')
					.get(id)
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
