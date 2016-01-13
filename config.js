
/*------
App Config
------------*/

module.exports = function() {

	var mode = process.env.ENV_MODE || 'LOCAL';

	/*------
	Environments
	------------*/

	var config = {

		LIVE: {
			APP_PORT: 8080,
			APP_DB_ADAPTER: 'rethinkdb',
			APP_AUTH_TOKEN_NAME: 'X-Accelerated-Auth-Token',
			APP_SALT: 'abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			RETHINKDB_HOST: 'localhost',
			RETHINKDB_PORT: 28015,
			RETHINKDB_DB: 'app',
			STRIPE_MODE: 'TEST',
			STRIPE_SK_TEST: '',
			STRIPE_PK_TEST: '',
			STRIPE_SK_LIVE: '',
			STRIPE_PK_LIVE: '',
			POSTMARK_API_TOKEN: '',
			POSTMARK_FROM: ''
		},
		
		TEST: {
			APP_PORT: 8080,
			APP_DB_ADAPTER: 'rethinkdb',
			APP_AUTH_TOKEN_NAME: 'X-Accelerated-Auth-Token',
			APP_SALT: 'abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			RETHINKDB_HOST: 'localhost',
			RETHINKDB_PORT: 28015,
			RETHINKDB_DB: 'app',
			STRIPE_MODE: 'TEST',
			STRIPE_SK_TEST: '',
			STRIPE_PK_TEST: '',
			STRIPE_SK_LIVE: '',
			STRIPE_PK_LIVE: '',
			POSTMARK_API_TOKEN: '',
			POSTMARK_FROM: ''
		},
		
		LOCAL: {
			APP_PORT: 8080,
			APP_DB_ADAPTER: 'rethinkdb',
			APP_AUTH_TOKEN_NAME: 'X-Accelerated-Auth-Token',
			APP_SALT: 'abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			RETHINKDB_HOST: 'localhost',
			RETHINKDB_PORT: 28015,
			RETHINKDB_DB: 'app',
			STRIPE_MODE: 'TEST',
			STRIPE_SK_TEST: '',
			STRIPE_PK_TEST: '',
			STRIPE_SK_LIVE: '',
			STRIPE_PK_LIVE: '',
			POSTMARK_API_TOKEN: '',
			POSTMARK_FROM: ''
		}
		
	};

	return config[mode];

};
