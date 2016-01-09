
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
	app = require('./items')(express, app, config, models);
	app = require('./stripe')(express, app, config, models);

	//Make sure this is last of routes
	app = require('./angular')(express, app, config, models);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
