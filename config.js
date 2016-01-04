module.exports = function() {
	var config = {
		LIVE: {
			PORT: 8080,
			DB_ADAPTER: 'rethinkdb'
		},
		TEST: {
			PORT: 8080,
			DB_ADAPTER: 'rethinkdb'
		},
		LOCAL: {
			PORT: 8080,
			DB_ADAPTER: 'rethinkdb'
		}
	};
	return config[process.env.ENV_MODE || 'LOCAL'];
}
