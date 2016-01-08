(function() {

	window.app.factory('accAuth', [function() {
		var that = this;
		this.token = {
			header: '',
			value: ''
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
					that.token.header = data.header;
					that.token.value = data.value;

					if (success) { success(); }
				},
				error: function(xhr) {
					switch (xhr.status) {
						case 404:
							that.token.header = '';
							that.token.value = '';
							if (notFound) { notFound(); }
						break;
						default:
							if (error) { error(); }
					}
				}
			});
		};

		this.verify = function() {
			console.log('verifying');
		};

		return this;
	}]);

})();