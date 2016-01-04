
/*------
Route Users
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Defining Local Router
	------------*/

	var router = express.Router();

	router.route('/')
		.post(function(req, res) {
			models.users.create();
			res.status(204).send();
		});

	/*------
	Returning Local Router
	------------*/

	return router;

};
