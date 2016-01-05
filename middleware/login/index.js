
/*------
Login Middleware
------------*/

module.exports = function(express, app, config, models) {

	/*------
	Dependencies
	------------*/


	/*------
	Helpers
	------------*/

	var helpers = {

		authenticate: function(req, res, next) {

			var token = req.get(config.APP_AUTH_TOKEN_NAME);

			if (!token) { 
				var message = config.APP_AUTH_TOKEN_NAME + ' header was not found!';
				return res.status(401).send(message); 
			}

			models.users.getByToken(token, function(status, user) { 

				if (!user) {
					var message = config.APP_AUTH_TOKEN_NAME + ' token has been invalidated! Token could have expired, but more likely the associated user does not exist anymore.';
					return res.status(401).send(message);
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

		models.users.getByUsername(req.param('user_username'), function(status, user, err) {

			if (user) {
				return res.status(400).send('Username already registered! Please select another username.'); 
			}

			models.users.createWithUsernameAndPassword(req.param('user_username'), req.param('user_password'), function(status, user, err) {
				return res.status(status).send(user);
			});

		});

	});

	app.post('/v1/login', function(req, res) {

		models.users.getByUsernameAndPassword(req.param('user_username'), req.param('user_password'), function(status, user, err) {

			if (!user) {
				return res.status(404).send('Could not find that user! Please check username and password');
			}

			models.users.assignTokenToUser(user.user_id, function(status, shallowUser, err) {
				if (err) { return res.status(status).send(err); }
				return res.status(201).send({ 
					header: config.APP_AUTH_TOKEN_NAME,
					value: shallowUser.user_token
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
