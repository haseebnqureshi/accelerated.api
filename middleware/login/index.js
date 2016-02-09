
/*------
Login Middleware
------------*/

module.exports = function(express, app, models) {

	/*------
	Dependencies
	------------*/


	/*------
	Helpers
	------------*/

	var helpers = {

		authenticate: function(req, res, next) {

			var token = req.get(process.env.EXPRESS_AUTH_TOKEN_NAME);

			if (!token) { 
				var message = process.env.EXPRESS_AUTH_TOKEN_NAME + ' header was not found!';
				return res.status(401).send(message); 
			}

			models.users.getByToken(token, function(status, user) { 

				if (!user) {
					var message = process.env.EXPRESS_AUTH_TOKEN_NAME + ' token has been invalidated! Token could have expired, but more likely the associated user does not exist anymore.';
					return res.status(401).send({ message: message });
				}

				req.user = user;
				next();

			});

		}

	};

	/*------
	Middleware
	------------*/

	app.post('/v1/register', function(req, res) {

		models.users.getByEmail(req.param('email'), function(status, user, err) {

			if (user) {
				var message = 'Email already registered! Please select another email.';
				return res.status(400).send({ message: message }); 
			}

			models.users.createWithEmailAndPassword(req.param('email'), req.param('password'), function(status, user, err) {

				models.users.update(user.id, {
					firstName: req.param('firstName'),
					lastName: req.param('lastName')
				}, function(status, user) {

					models.emails.sendTo(req.param('email'), 'onRegistration', user);
					return res.status(status).send(user);
				});
			});
		});

	});

	app.post('/v1/login', function(req, res) {

		models.users.getByEmailAndPassword(req.param('email'), req.param('password'), function(status, user, err) {

			if (!user) {
				var message = 'Could not find that user! Please check email and password.';
				return res.status(404).send({ message: message });
			}

			models.users.assignTokenToUser(user.id, function(status, shallowUser, err) {
				if (err) { return res.status(status).send(err); }
				return res.status(201).send({ 
					header: process.env.EXPRESS_AUTH_TOKEN_NAME,
					value: shallowUser.token
				});
			});

		});

	});

	app.use('/v1/*', helpers.authenticate);

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};
