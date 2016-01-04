(function() {

	var app = window.app;

	app.directive('manageUsers', function() {
		return {
			restrict: 'E',
			templateUrl: '/elements/manageUsers.html',
			controller: ['$scope', '$routeParams', 'users', function($scope, $routeParams, users) {
				var that = this;
				this.users = users;
			}],
			controllerAs: 'ManageUsersCtrl'
		}
	});

})();