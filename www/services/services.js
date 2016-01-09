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
				success: function(data, textStatus, xhr) {
					that.login(data, success || null);

					if (success) { success(data); }
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

		var ajax = function(method, resource, data, success, error) {

			var headers = null;
			var requestHeader = accAuth.getAuth('requestHeader');
			if (requestHeader) {
				headers = {};
				headers[requestHeader.key] = requestHeader.value;
			}

			$.ajax({
				method: method,
				url: window.endpoint + resource,
				dataType: 'json',
				data: data || {},
				headers: headers,
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
			});
		};

		this.get = function(resource, success, error) {
			ajax('GET', resource, null, success || null, error || null);
		};

		this.post = function(resource, data, success, error) {
			ajax('POST', resource, data || null, success || null, error || null);
		};

		this.put = function(resource, data, success, error) {
			ajax('PUT', resource, data || null, success || null, error || null);
		};

		this.delete = function(resource, success, error) {
			ajax('DELETE', resource, null, success || null, error || null);
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


})();