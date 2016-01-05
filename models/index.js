
/*------
App Models
------------*/

module.exports = function(config) {

	/*------
	Helpers
	------------*/

	// Selecting resource adapter model with adapter override
	var filepath = function(resourceSlug, APP_DB_ADAPTER) {
		return './' + resourceSlug + '/' + (APP_DB_ADAPTER || config.APP_DB_ADAPTER) + '.js';
	};

	/*------
	Models
	------------*/

	var users = require(filepath('users'))(config);

	/*------
	Returning Final Models Object
	------------*/

	return {
		users: users
	};

};
