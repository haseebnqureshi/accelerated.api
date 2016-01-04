(function() {

	window.app.factory('users', function() {
		var that = this;
		this.getUser = function(id) {
			alert('Service users.getUser() called');
		};
		this.putUser = function(id, args) {
			alert('Service users.putUser() called');
		};
		this.postUser = function(args) {
			alert('Service users.postUser() called');
		};
		this.deleteUser = function(id) {
			alert('Service users.deleteUser() called');
		};
		return this;
	});

})();