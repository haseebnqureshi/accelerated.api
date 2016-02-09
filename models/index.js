
/*------
App Models
------------*/

module.exports = function() {

	/*------
	Helpers
	------------*/

	// Selecting resource adapter model with adapter override
	var filepath = function(resourceSlug, EXPRESS_DB_ADAPTER) {
		return './' + resourceSlug + '/' + (EXPRESS_DB_ADAPTER || process.env.EXPRESS_DB_ADAPTER) + '.js';
	};

	/*------
	Models
	------------*/

	var emails = require(filepath('emails'))();
	var users = require(filepath('users'))();
	var items = require(filepath('items'))();

	/*------
	Returning Final Models Object
	------------*/

	return {
		emails: emails,
		users: users,
		items: items
	};

};
