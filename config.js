
module.exports = function() {

	var mode = process.env.ENV_MODE || 'LOCAL';

	/*------
	Environments
	------------*/

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

	return config[mode];

};
