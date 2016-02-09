
/*------
App Middleware
------------*/

module.exports = function(express, app, models) {

	/*------
	Dependencies
	------------*/

	var bodyParser = require('body-parser');

	/*------
	Middleware
	------------*/

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({ type: 'application/json' }));
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});

	/*------
	Loaded Middleware
	------------*/

	app = require('./login')(express, app, models);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
