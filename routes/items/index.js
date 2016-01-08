
/*------
Route Items
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Defining Local Router
	------------*/

	var router = express.Router();

	router.route('/')

		.post(function(req, res) {
			models.items.create(req.body, function(status, data) { 
				return res.status(status).send(data);
			});
		})

		.get(function(req, res) {
			models.items.getAll(function(status, data) {
				return res.status(status).send(data);
			});
		});

	router.route('/:item_id')
	
		.get(function(req, res) {
			models.items.getById(req.params.item_id, function(status, data) {
				return res.status(status).send(data);
			});
		})

		.put(function(req, res) {
			models.items.update(req.params.item_id, req.body, function(status, data) { 
				return res.status(status).send(data);
			});
		})
	
		.delete(function(req, res) {
			models.items.delete(req.params.item_id, function(status, data) {
				return res.status(status).send(data);
			});
		});

	/*------
	Strapping onto App
	------------*/

	app.use('/v1/items', router);

	/*------
	Returning App
	------------*/

	return app;

};
