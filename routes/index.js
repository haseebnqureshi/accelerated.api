
/*------
App Routes
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/


	/*------
	Routes
	------------*/

	app = require('./login')(express, app, config, models);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
