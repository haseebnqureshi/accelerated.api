
/*------
Route Login
------------*/

module.exports = function(express, app, models) {

	/*------
	Defining Local Router
	------------*/

	var router = express.Router();

	router.route('/')

		.get(function(req, res) {
			return res.status(200).send(req.user);
		})
	
		.put(function(req, res) {
			models.users.update(req.user.id, req.body, function(status, data) { 
				return res.status(status).send(data);
			});
		})
	
		.delete(function(req, res) {
			models.users.delete(req.user.id, function(status, data) {
				return res.status(status).send(data);
			});
		});

	/*------
	Strapping onto App
	------------*/

	app.use('/v1/user', router);

	/*------
	Returning App
	------------*/

	return app;

};
