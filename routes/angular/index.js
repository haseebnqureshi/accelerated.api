
/*------
Route Angular
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Defining Local Router
	------------*/

	var router = express.Router();

	router.route('/*')

		.get(function(req, res) {
			return res.status(200).sendFile(app.get('rootPath') + '/www/index.html');
		});
	
	/*------
	Strapping onto App
	------------*/

	app.use('/', router);

	/*------
	Returning App
	------------*/

	return app;

};
