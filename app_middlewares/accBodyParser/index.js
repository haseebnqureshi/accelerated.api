
/*------
Acc Body Parser Middleware
------------*/

module.exports = function(express, app, models) {

	/*------
	Dependencies
	------------*/

	var bodyParser = require('body-parser');

	/*------
	Helpers
	------------*/


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
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
