
/*------
App Routes
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/

	var _ = require('underscore');

	/*------
	Routes
	------------*/

	app.use('/documents', require('./documents/index.js')(express, app, config, models));
	app.use('/users', require('./users/index.js')(express, app, config, models));

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
