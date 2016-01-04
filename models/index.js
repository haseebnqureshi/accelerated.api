
/*------
App Models
------------*/

module.exports = function(config) {

	/*------
	Helpers
	------------*/

	// Selecting resource adapter model with adapter override
	var filepath = function(resourceSlug, DB_ADAPTER) {
		return './' + resourceSlug + '/' + (DB_ADAPTER || config.DB_ADAPTER) + '.js';
	};

	/*------
	Models
	------------*/

	var models = {};
	var users = require(filepath('users'))(config);
	var documents = require(filepath('documents'))(config, users);

	/*------
	Returning Final Models Object
	------------*/

	return {
		users: users,
		documents: documents
	};

};
