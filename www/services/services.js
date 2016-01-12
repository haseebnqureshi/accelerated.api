(function() {

	window.app.factory('accAuth', ['$cookies', function($cookies) {
		var that = this;

		this.cookieKey = 'accelerated-auth';
		this.cookie = null;
		this.expiration = function() {
			var now = new Date().getTime();
			var future = now + (1000 * 60 * 60 * 24 * 365);
			var expiration = new Date(future);
			return expiration;
		};

		this.getAuth = function(property) {
			if (!this.cookie) { return null; }
			if (!this.cookie[property]) { return null; }
			return this.cookie[property];
		};

		this.screen = function(callback) {

			//skip logic if our cookie exists
			if (this.cookie && callback) { return callback(true, false, false); }

			this.cookie = $cookies.getObject(this.cookieKey);
			var isAllowed = false;
			var wasScanned = false;

			//frisking for cookie
			if (_.has(this.cookie, 'requestHeader')) {
				if (_.has(this.cookie.requestHeader, 'value')) {
					if (this.cookie.requestHeader.value.length == 40) {
						isAllowed = true;
					}
				}
			}
			var wasFrisked = true;

			if (callback) { callback(isAllowed, wasFrisked, wasScanned); }
		};

		this.login = function(data, success, notFound, error) {
			$.ajax({
				method: 'POST',
				url: window.endpoint + '/login',
				dataType: 'json',
				data: {
					email: data.email,
					password: data.password
				},
				success: function(data, textStatus, xhr) {
					that.cookie = {
						requestHeader: {
							key: data.header,
							value: data.value
						}
					};
					$cookies.putObject(that.cookieKey, that.cookie, { expires: that.expiration() });
					if (success) { success(data); }
				},
				error: function(xhr) {
					switch (xhr.status) {
						case 404:
							$cookies.remove(that.cookie);
							if (notFound) { notFound(xhr); }
						break;
						default:
							if (error) { error(xhr); }
					}
				}
			});
		};

		this.logout = function(callback) {
			$cookies.remove(that.cookieKey);
			if (callback) { callback(); }
		};	

		this.register = function(data, success, alreadyEmail, error) {
			$.ajax({
				method: 'POST',
				url: window.endpoint + '/register',
				dataType: 'json',
				data: {
					email: data.email,
					password: data.password,
					firstName: data.firstName,
					lastName: data.lastName
				},
				success: function(resData, textStatus, xhr) {
					that.login(data, success || null);
				},
				error: function(xhr) {
					switch (xhr.status) {
						case 400:
							if (alreadyEmail) { alreadyEmail(xhr); }
						break;
						default:
							if (error) { error(xhr); }
					}
				}
			});
		};

		return this;
	}]);

	window.app.factory('accAuthAjax', ['$location', '$timeout', 'accAuth', function($location, $timeout, accAuth) {
		var that = this;

		var ajax = {
			headers: function() {
				var headers = null;
				var requestHeader = accAuth.getAuth('requestHeader');
				if (requestHeader) {
					headers = {};
					headers[requestHeader.key] = requestHeader.value;
				}
				return headers;
			},

			run: function(method, resource, data, success, error) {
				var args = {
					method: method,
					url: window.endpoint + resource,
					dataType: 'json',
					data: data || {},
					headers: this.headers(),
					success: function(data, textStatus, xhr) {
						if (success) { success(data, textStatus, xhr); }
					},
					error: function(xhr) {
						switch (xhr.status) {
							case 401:
								$timeout(function() {
									$location.path('/login');
								}, 1000);
							break;
						}
						if (error) { error(xhr); }
					}
				};
				$.ajax(args);
			}	
		};

		this.get = function(resource, success, error) {
			ajax.run('GET', resource, null, success || null, error || null);
		};

		this.post = function(resource, data, success, error) {
			ajax.run('POST', resource, data || null, success || null, error || null);
		};

		this.put = function(resource, data, success, error) {
			ajax.run('PUT', resource, data || null, success || null, error || null);
		};

		this.delete = function(resource, success, error) {
			ajax.run('DELETE', resource, null, success || null, error || null);
		};

		return this;
	}]);

	window.app.factory('accUser', ['accAuthAjax', function(ajax) {
		var that = this;

		this.get = function(success, error) {
			ajax.get('/user', success || null, error || null);
		};

		this.put = function(data, success, error) {
			ajax.put('/user', data, success || null, error || null);
		};

		return this;
	}]);

	window.app.factory('accItems', ['accAuthAjax', function(ajax) {
		var that = this;

		this.getAll = function(success, error) {
			ajax.get('/items', success || null, error || null);
		};

		this.post = function(data, success, error) {
			ajax.post('/items', data, success || null, error || null);
		};

		this.get = function(id, success, error) {
			ajax.get('/items/' + id, success || null, error || null);
		};

		this.put = function(id, data, success, error) {
			ajax.put('/items/' + id, data, success || null, error || null);
		};

		this.delete = function(id, success, error) {
			ajax.delete('/items/' + id, success || null, error || null);
		};

		return this;		
	}]);

	window.app.factory('accPaywall', ['$location', 'accAuthAjax', function($location, ajax) {
		var that = this;

		this.suggest = function() {
			alert('You should upgrade.');
		};

		this.warn = function() {
			alert('Careful! You should upgrade.');
		};

		this.force = function() {
			$location.path('/upgrade');
		};

		this.watchUsage = function($scope, collectionKey, actions) {
			$scope.$watchCollection(collectionKey, function(collection) {
				var count = collection.length;
				_.each(actions, function(action, actionType) {
					var start = action[0];
					var end = action[1];
					var callback = action[2];
					if (count >= start && count <= end) {
						if (that[actionType]) { that[actionType](); }
						if (callback) { callback(); }
					}
				});
			});
		};

		return this;
	}]);


	window.app.factory('accStripe', ['accAuthAjax', function(accAuthAjax) {
		var that = this;
		this.customers = {};
		this.invoices = {};
		this.plans = {};

		this.customers.create = function(sourceToken, successCallback, errorCallback) {
			accAuthAjax.post('/stripe/customer', {
				source: sourceToken,
				plan: 'acceleratedTest'
			}, successCallback || null, errorCallback || null);
		};

		this.customers.createSource = function(sourceToken, successCallback, errorCallback) {
			accAuthAjax.post('/stripe/customer/createSource', {
				source: sourceToken
			}, successCallback || null, errorCallback || null);
		};

		this.customers.get = function(successCallback, errorCallback) {
			accAuthAjax.get('/stripe/customer', successCallback || null, errorCallback || null);
		};

		this.customers.updateSubscription = function(subscriptionId, planId, successCallback, errorCallback) {
			accAuthAjax.put('/stripe/customer/updateSubscription', {
				subscriptionId: subscriptionId,
				planId: planId
			}, successCallback || null, errorCallback || null);
		};

		this.invoices.list = function(successCallback, errorCallback) {
			accAuthAjax.get('/stripe/invoices', successCallback || null, errorCallback || null);
		};

		this.plans.list = function(successCallback, errorCallback) {
			accAuthAjax.get('/stripe/plans', successCallback || null, errorCallback || null);
		};

		this.createToken = function($form, successCallback, errorCallback) {
			Stripe.card.createToken($form, function(status, response) {
				if (response.error && errorCallback) { 
					return errorCallback(response.error.message); 
				}
				if (successCallback) { 
					return successCallback(response.id, response); 
				}
			});
		};

		this.setup = function(callback) {

			//Conditionally attaching stripe script
			var src = 'https://js.stripe.com/v2/';
			var scripts = document.getElementsByTagName('script');
			var stripeScript = _.findWhere(scripts, { src: src });

			//Returning out if we've found the script attached
			if (stripeScript) { 
				if (callback) { return callback(); }
				return;
			}
			
			//Otherwise, creating new script and appending
			var script = document.createElement('script');
			script.src = src;
			document.body.appendChild(script);

			//Then waiting to return callblack on load
			script.addEventListener('load', function(event) {

				//Setting publishable key
				Stripe.setPublishableKey('pk_test_z27Dpn6TqrsOS6JVSGVgDb4H');

				if (callback) { return callback(); }
			});
		};

		return this;
	}]);


})();