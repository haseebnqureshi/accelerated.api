(function() {

	window.app.factory('accAuth', ['$cookies', function($cookies) {
		var that = this;

		this.cookieKey = 'accelerated-auth';
		this.cookie = null;
		this.isAllowed = false;
		this.wasFrisked = false;
		this.wasScanned = false;

		this.expiration = function() {
			var now = new Date().getTime();
			var future = now + (1000 * 60 * 60 * 24 * 365);
			var expiration = new Date(future);
			return expiration;
		};

		this.getAuth = function(property) {
			if (!this.cookie) { return null; }
			if (!this.cookie[property]) { return undefined; }
			return this.cookie[property];
		};

		this.setAuth = function(property, value) {
			if (!this.cookie) { return null; }
			this.cookie[property] = value;
		};

		this.screen = function(callback) {

			//skip logic if our cookie exists
			if (this.cookie && callback) { 
				that.isAllowed = true;
				that.wasFrisked = false;
				that.wasScanned = false;
				return callback(that.isAllowed, that.wasFrisked, that.wasScanned); 
			}

			this.cookie = $cookies.getObject(this.cookieKey);
			that.isAllowed = false;
			that.wasScanned = false;

			//frisking for cookie
			if (_.has(this.cookie, 'requestHeader')) {
				if (_.has(this.cookie.requestHeader, 'value')) {
					if (this.cookie.requestHeader.value.length == 40) {
						that.isAllowed = true;
					}
				}
			}
			that.wasFrisked = true;

			if (callback) { callback(that.isAllowed, that.wasFrisked, that.wasScanned); }
		};

		this.persistAuth = function() {
			$cookies.putObject(that.cookieKey, that.cookie, { expires: that.expiration() });
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

			run: function(method, resource, data, success, error, done) {
				var args = {
					method: method,
					url: window.endpoint + resource,
					dataType: 'json',
					data: data || {},
					headers: this.headers(),
					success: function(data, textStatus, xhr) {
						if (success) { success(data, textStatus, xhr); }
						if (done) { done(xhr, data); }
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
						if (done) { done(xhr); }
					}
				};
				$.ajax(args);
			}	
		};

		this.get = function(resource, success, error, done) {
			ajax.run('GET', resource, null, success || null, error || null, done || null);
		};

		this.post = function(resource, data, success, error, done) {
			ajax.run('POST', resource, data || null, success || null, error || null, done || null);
		};

		this.put = function(resource, data, success, error, done) {
			ajax.run('PUT', resource, data || null, success || null, error || null, done || null);
		};

		this.delete = function(resource, success, error, done) {
			ajax.run('DELETE', resource, null, success || null, error || null, done || null);
		};

		return this;
	}]);

	window.app.factory('accUser', ['accAuthAjax', function(ajax) {
		var that = this;

		this.get = function(success, error, done) {
			ajax.get('/user', success || null, error || null, done || null);
		};

		this.put = function(data, success, error, done) {
			ajax.put('/user', data, success || null, error || null, done || null);
		};

		return this;
	}]);

	window.app.factory('accItems', ['accAuthAjax', function(ajax) {
		var that = this;

		this.getAll = function(success, error, done) {
			ajax.get('/items', success || null, error || null, done || null);
		};

		this.post = function(data, success, error, done) {
			ajax.post('/items', data, success || null, error || null, done || null);
		};

		this.get = function(id, success, error, done) {
			ajax.get('/items/' + id, success || null, error || null, done || null);
		};

		this.put = function(id, data, success, error, done) {
			ajax.put('/items/' + id, data, success || null, error || null, done || null);
		};

		this.delete = function(id, success, error, done) {
			ajax.delete('/items/' + id, success || null, error || null, done || null);
		};

		return this;		
	}]);

	window.app.factory('accPaywall', ['$location', 'accAuthAjax', 'accAuth', function($location, ajax, accAuth) {
		var that = this;

		this.suggest = function(data) {
			if (data.customerDelinquent == 'no') { return; }
			alert('You should upgrade.');
		};

		this.warn = function(data) {
			if (data.customerDelinquent == 'no') { return; }
			alert('Careful! You should upgrade.');
		};

		this.force = function(data) {
			if (data.customerDelinquent == 'no') { return; }
			$location.path('/upgrade');
		};

		this.watchUsage = function($scope, collectionKey, actions) {
			$scope.$watchCollection(collectionKey, function(collection) {

				/* 
				Right now, this only works with not-a-customer vs. customer.
				Multiple plans are not fully implemented, but you CAN get information
				about their subscription plan, and then write conditional statements
				that adjust their usage!

				So in other words, you can conditionally restrict usage, but
				we haven't abstracted clear systems to better manage this conditionality.
				*/

				var data = {
					customerDelinquent: accAuth.getAuth('customerDelinquent'), 
					subscriptionPlan: accAuth.getAuth('subscriptionPlan') 
				};

				var count = collection.length;
				_.each(actions, function(action, actionType) {
					var start = action[0];
					var end = action[1];
					var callback = action[2];
					if (count >= start && count <= end) {
						if (that[actionType]) { that[actionType](data); }
						if (callback) { callback(data); }
					}
				});
			});
		};

		return this;
	}]);


	window.app.factory('accStripe', ['accAuthAjax', 'accAuth', function(accAuthAjax, accAuth) {
		var that = this;
		this.customers = {};
		this.invoices = {};
		this.plans = {};

		this.getPublishableKey = function(successCallback, errorCallback, doneCallback, doneCallback) {
			accAuthAjax.get('/stripe/getPublishableKey', successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.create = function(sourceToken, successCallback, errorCallback, doneCallback) {
			accAuthAjax.post('/stripe/customer', {
				source: sourceToken,
				plan: 'acceleratedTest'
			}, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.createSource = function(sourceToken, successCallback, errorCallback, doneCallback) {
			accAuthAjax.post('/stripe/customer/createSource', {
				source: sourceToken
			}, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.createSubscription = function(planId, successCallback, errorCallback, doneCallback) {
			accAuthAjax.post('/stripe/customer/createSubscription', {
				planId: planId
			}, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.get = function(successCallback, errorCallback, doneCallback) {
			accAuthAjax.get('/stripe/customer', function(customer) {

				/* IMPORTANT: CHECKING CUSTOMER STATUS AND PERSISTING AUTH COOKIE */

				if (customer.delinquent != null) {
					accAuth.setAuth('customerDelinquent', customer.delinquent ? 'yes' : 'no');
				}
				
				if (customer.subscriptions != null) {
					if (customer.subscriptions.data[0]) {
						if (customer.subscriptions.data[0].plan) {
							accAuth.setAuth('subscriptionPlan', customer.subscriptions.data[0].plan);
						}
					}
				}
				accAuth.persistAuth();

				if (successCallback) { return successCallback(customer); }
			}, errorCallback || null, doneCallback || null);
		};

		this.customers.update = function(data, successCallback, errorCallback, doneCallback) {
			accAuthAjax.put('/stripe/customer', data, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.updateSubscription = function(subscriptionId, planId, successCallback, errorCallback, doneCallback) {
			accAuthAjax.put('/stripe/customer/updateSubscription', {
				subscriptionId: subscriptionId,
				planId: planId
			}, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.cancelSubscription = function(subscriptionId, successCallback, errorCallback, doneCallback) {
			accAuthAjax.post('/stripe/customer/cancelSubscription', {
				subscriptionId: subscriptionId
			}, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.customers.deleteCard = function(cardId, successCallback, errorCallback, doneCallback) {
			accAuthAjax.delete('/stripe/customer/deleteCard/' + cardId, successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.invoices.list = function(successCallback, errorCallback, doneCallback) {
			accAuthAjax.get('/stripe/invoices', successCallback || null, errorCallback || null, doneCallback || null);
		};

		this.plans.list = function(successCallback, errorCallback, doneCallback) {
			accAuthAjax.get('/stripe/plans', successCallback || null, errorCallback || null, doneCallback || null);
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

				that.getPublishableKey(function(data) {
				
					//Setting publishable key
					Stripe.setPublishableKey(data.key);

					if (callback) { return callback(); }

				});
			});
		};

		return this;
	}]);


})();