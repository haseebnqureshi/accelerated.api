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

		this.screen = function(callback) {
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
					if (success) { success(); }
				},
				error: function(xhr) {
					switch (xhr.status) {
						case 404:
							$cookies.remove(that.cookie);
							if (notFound) { notFound(); }
						break;
						default:
							if (error) { error(); }
					}
				}
			});
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

					if (success) { success(); }
				},
				error: function(xhr) {
					switch (xhr.status) {
						case 400:
							if (alreadyEmail) { alreadyEmail(); }
						break;
						default:
							if (error) { error(); }
					}
				}
			});
		};

		return this;
	}]);

})();