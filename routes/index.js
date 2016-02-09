
/*------
App Routes
------------*/

module.exports = function(express, app, models) {

	/*------
	Dependencies
	------------*/


	/*------
	Routes
	------------*/

	app = require('./login')(express, app, models);
	app = require('./items')(express, app, models);
	app = require('./stripe')(express, app, models);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
