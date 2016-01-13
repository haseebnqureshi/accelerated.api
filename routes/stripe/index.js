
/*------
Route Stripe
------------*/

/*
This is a strange router that should be reworked later, because
it heavily relies on our authenticated user and its parameters.

For instance, fetching all invoices for a stripe customer, almost
feels that it should live at 'v1/user/invoices' instead, implying
the need for the req.user object.
*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/

	var _ = require('underscore');
	var stripe = require('stripe')(config['STRIPE_SK_' + config.STRIPE_MODE]);

	/*------
	Defining Local Router
	------------*/

	var router = express.Router();

	router.route('/getPublishableKey')
		.get(function(req, res) {
			var key = config['STRIPE_PK_' + config.STRIPE_MODE];
			if (!key || key == '') { return res.status(500).send(); }
			return res.status(200).send({ key: key });
		});

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

	router.route('/customer')

		.get(function(req, res) {
			if (!req.user.customerId) { return res.status(400).send({ message: 'No customer id associated with this user!' }); }
			stripe.customers.retrieve(req.user.customerId, function(err, customer) {
				if (err) { return res.status(err.statusCode).send(err); }
				if (customer.delinquent) { return res.status(err.statusCode).send(err); }

				return res.status(200).send(customer);
			});
		})

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
		})

		.put(function(req, res) {
			if (!req.user.customerId) { return res.status(404).send([]); }
			var args = _.pick(req.body, ['account_balance', 'coupon', 'default_source', 'description', 'email', 'metadata', 'shipping', 'source']);
			stripe.customers.update(req.user.customerId, args, function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				return res.status(200).send(response);
			});
		});

	router.route('/customer/createSource')

		.post(function(req, res) {
			if (!req.user.customerId) { return res.status(400).send({ message: 'No customer id associated with this user!' }); }
			var source = req.param('source') || 'source';
			stripe.customers.createSource(req.user.customerId, {
				source: source
			}, function(err, card) {
				if (err) { return res.status(err.statusCode).send(err); }
				return res.status(200).send(card);
			});
		});

	router.route('/customer/deleteCard/:cardId')

		.delete(function(req, res) {
			if (!req.user.customerId) { return res.status(400).send({ message: 'No customer id associated with this user!' }); }
			stripe.customers.deleteCard(req.user.customerId, req.params.cardId, function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				return res.status(200).send(response);
			});
		});

	router.route('/customer/updateSubscription')

		.put(function(req, res) {
			if (!req.user.customerId) { return res.status(400).send({ message: 'No customer id associated with this user!' }); }
			if (!req.param('subscriptionId')) { return res.status(400).send([]); }
			if (!req.param('planId')) { return res.status(400).send([]); }

			stripe.customers.updateSubscription(req.user.customerId, req.param('subscriptionId'), {
				plan: req.param('planId')
			}, function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				return res.status(200).send(response);
			});
		});

	router.route('/customer/createSubscription')

		.post(function(req, res) {
			if (!req.user.customerId) { return res.status(400).send({ message: 'No customer id associated with this user!' }); }
			if (!req.param('planId')) { return res.status(400).send([]); }

			stripe.customers.createSubscription(req.user.customerId, {
				plan: req.param('planId')
			}, function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				return res.status(200).send(response);
			});
		});

	router.route('/customer/cancelSubscription')

		.post(function(req, res) {
			if (!req.user.customerId) { return res.status(400).send({ message: 'No customer id associated with this user!' }); }
			if (!req.param('subscriptionId')) { return res.status(400).send([]); }

			stripe.customers.cancelSubscription(req.user.customerId, req.param('subscriptionId'), function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				return res.status(200).send(response);
			});
		});

	router.route('/invoices')

		.get(function(req, res) {
			if (!req.user.customerId) { return res.status(404).send([]); }
			stripe.invoices.list({
				limit: 10,
				customer: req.user.customerId
			}, function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				var status = _.isEmpty(response.data) ? 404 : 200;
				return res.status(status).send(response.data);
			});
		});

	router.route('/plans')

		.get(function(req, res) {
			stripe.plans.list({
				limit: 10
			}, function(err, response) {
				if (err) { return res.status(err.statusCode).send(err); }
				var status = _.isEmpty(response.data) ? 404 : 200;
				return res.status(status).send(response.data);
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
