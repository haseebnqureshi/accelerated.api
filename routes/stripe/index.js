
/*------
Route Stripe
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/

	var stripe = require('stripe')(config['STRIPE_SK_' + config.STRIPE_MODE]);

	/*------
	Defining Local Router
	------------*/

	var router = express.Router();

	router.route('/events')

		.post(function(req, res) {
			var data = req.body.data;
			stripe.customers.retrieve(data.object.customer, function(err, customer) {
				console.log({ data: data, customer: customer });
				switch(data.type) {
					//@see https://stripe.com/docs/api#event_types
					case 'charge.succeeded':
					case 'charge.refunded':
					case 'customer.subscription.created':
					case 'customer.subscription.deleted':
					break;
				}
				res.status(204).send();
			});
		});

	router.route('/customers')

		//Creating customers assumes the user has been registered
		.post(function(req, res) {
			var plan = req.param('plan') || 'plan';
			var source = req.param('source') || 'source';

			stripe.customers.create({
				email: req.user.email,
				plan: plan,
				source: source
			}, function(err, customer) {
				if (err) { return res.status(err.statusCode).send(err); }
				if (customer.delinquent) { return res.status(err.statusCode).send(err); }

				models.users.update(req.user.id, {
					customerId: customer.id,
					subscriptionId: plan
				}, function() {
					return res.status(204).send();
				});
			});
		});

	/*------
	Strapping onto App
	------------*/

	app.use('/v1/stripe', router);

	/*------
	Returning App
	------------*/

	return app;

};
