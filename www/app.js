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

		$httpProvider.interceptors.push(['$location', function($location) {
			return {
				request: function(config) {
					switch ($location.$$path) {
						case '/dashboard':
							console.log(config.headers);
						break;
					}
					return config;
				},
				responseErr: function(response) {
					console.log('response', response);
					return response;
				}
			}
		}]);


	});

})();