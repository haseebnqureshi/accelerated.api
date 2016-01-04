
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

	var router = express.Router();
	router.route('/documents')
		.post(function(req, res) {
			models.documents.createWithUser();
		});
	app.use('/', router);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
