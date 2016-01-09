(function() {

	jQuery(function($) {

		$(document).foundation();

	});

	window.endpoint = 'http://192.168.80.80:8080/v1';

	window.app = angular.module('appPublic', ['ngRoute', 'ngCookies', 'ngAnimate']);
	
	window.app.config(function($routeProvider, $locationProvider, $httpProvider) {
		
		$routeProvider
			.when('/', {
				templateUrl: '/pages/home.html'
			})
			.when('/login', {
				templateUrl: '/pages/login.html'
			})
			.when('/dashboard', {
				templateUrl: '/pages/dashboard.html'
			})
			.when('/upgrade', {
				templateUrl: '/pages/upgrade.html'
			});

		$locationProvider.html5Mode(true);

		$httpProvider.interceptors.push(['$location', 'accAuth', function($location, accAuth) {
			return {
				request: function(config) {
					switch ($location.$$path) {
						case '/dashboard':
						case '/upgrade':
							accAuth.screen(function(isAllowed) {
								if (!isAllowed) { 
									$location.path('/login'); 
									return;
								}
								return config;
							});
						break;
					}
					return config;
				}
			}
		}]);

	});

})();