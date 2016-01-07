
/*------
Login Middleware
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/


	/*------
	Helpers
	------------*/


	/*------
	Middleware
	------------*/

	app.use('/', express.static('www'));

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
