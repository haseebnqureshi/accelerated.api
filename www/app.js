(function() {

	window.app = angular.module('appPublic', ['ngRoute']);
	
	window.app.config(function($routeProvider, $locationProvider, $httpProvider) {
		
		$routeProvider
			.when('/', {
				templateUrl: '/pages/home.html'
			})
			.when('/dashboard', {
				templateUrl: '/pages/dashboard.html'
			});

		$locationProvider.html5Mode(true);

		$httpProvider.interceptors.push(['$location', 'accAuth', function($location, accAuth) {
			return {
				request: function(config) {
					switch ($location.$$path) {
						case '/dashboard':
							accAuth.verify();
						break;
					}
					return config;
				},
				responseErr: function(response) {

					return response;
				}
			}
		}]);

	});

})();