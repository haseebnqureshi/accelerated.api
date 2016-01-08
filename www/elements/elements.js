(function() {

	var app = window.app;

	app.directive('formUserRegister', function() {
		return {
			restrict: 'E',
			templateUrl: '/elements/formUserRegister.html',
			controller: ['$scope', '$routeParams', 'accAuth', function($scope, $routeParams, accAuth) {
				var that = this;

				this.view = {
					message: '',
					messageClass: 'secondary',
					buttonClass: 'disabled'
				};

				this.data = {
					email: '',
					firstName: '',
					lastName: '',
					password: '',
					confirmPassword: ''
				};

				this.checkPasswordMatch = function() {
					if (this.data.password != this.data.confirmPassword) {
						this.view.message = 'Your passwords do not match.';
						this.view.messageClass = 'secondary';
						this.view.buttonClass = 'disabled';
						return false;
					}
					this.view.message = 'Passwords match!';
					this.view.messageClass = 'success';
					this.checkFormState();
					return true;
				};

				this.checkFormState = function() {
					var empty = _.filter(this.data, function(value) {
						return value === undefined || value === '';
					});
					this.changeButtonStatus(empty.length == 0 ? true : false);
				};	

				this.changeButtonStatus = function(statusBoolean) {
					this.view.buttonClass = statusBoolean ? 'success' : 'disabled';
				};

				this.submit = function() {
					if (this.checkPasswordMatch() == false) { return; }
					accAuth.register(this.data, function() {
						alert('Welcome! You are now logged in!');	
					}, function() {
						alert('Email has already been registered!');
					}, function() {
						alert('Please try again!');
					});
				};
			}],
			controllerAs: 'FormUserRegisterCtrl'
		}
	});

	app.directive('formUserLogin', function() {
		return {
			restrict: 'E',
			templateUrl: '/elements/formUserLogin.html',
			controller: ['$scope', '$routeParams', 'accAuth', function($scope, $routeParams, accAuth) {
				var that = this;

				this.view = {
					message: '',
					messageClass: 'secondary',
					buttonClass: 'disabled'
				};

				this.data = {
					email: '',
					password: ''
				};

				this.checkFormState = function() {
					var empty = _.filter(this.data, function(value) {
						return value === undefined || value === '';
					});
					this.changeButtonStatus(empty.length == 0 ? true : false);
				};	

				this.changeButtonStatus = function(statusBoolean) {
					this.view.buttonClass = statusBoolean ? 'success' : 'disabled';
				};

				this.submit = function() {
					accAuth.login(this.data, function() {
						alert('Logging you in');
					}, function() {
						alert('Email and/or password combination did not work!');
					}, function() {
						alert('Please try again.');
					});
				};
			}],
			controllerAs: 'FormUserLoginCtrl'
		}
	});

	app.directive('formForgotPassword', function() {
		return {
			restrict: 'E',
			templateUrl: '/elements/formForgotPassword.html',
			controller: ['$scope', '$routeParams', function($scope, $routeParams) {
				var that = this;

				this.view = {
					showFields: false,
					message: '',
					messageClass: 'secondary',
					buttonClass: 'disabled'
				};

				this.data = {
					email: ''
				};

				this.checkFormState = function() {
					var empty = _.filter(this.data, function(value) {
						return value === undefined || value === '';
					});
					this.changeButtonStatus(empty.length == 0 ? true : false);
				};	

				this.changeButtonStatus = function(statusBoolean) {
					this.view.buttonClass = statusBoolean ? 'success' : 'disabled';
				};

				this.toggleFields = function() {
					this.view.showFields = this.view.showFields ? false : true;
				};

				this.submit = function() {

				};
			}],
			controllerAs: 'FormForgotPasswordCtrl'
		}
	});


})();