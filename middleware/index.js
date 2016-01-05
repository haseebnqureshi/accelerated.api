
/*------
App Middleware
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/

	var bodyParser = require('body-parser');

	/*------
	Middleware
	------------*/

	app.use('/', express.static('www'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({ type: 'application/json' }));
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});

	/*------
	Loaded Middleware
	------------*/

	app = require('./login')(express, app, config, models);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
