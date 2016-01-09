(function() {

	var app = window.app;

	app.directive('formForgotPassword', function() {

		/*
		TODO: Use $scope here and in template
		*/

		return {
			restrict: 'E',
			templateUrl: '/elements/formForgotPassword.html',
			controller: ['$scope', function($scope) {
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

	app.directive('formUserLogin', function() {

		/*
		TODO: Use $scope here and in template
		*/

		return {
			restrict: 'E',
			templateUrl: '/elements/formUserLogin.html',
			controller: ['$scope', '$timeout', '$location', 'accAuth', function($scope, $timeout, $location, accAuth) {
				var that = this;

				this.view = {
					message: '',
					messageClass: 'secondary',
					buttonClass: 'disabled',
					buttonHide: false
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
						that.view.message = 'Logging in now!';
						that.view.messageClass = 'success';
						that.view.buttonClass = 'disabled';
						$scope.$apply();
						$timeout(function() {
							$location.path('/dashboard');
						}, 1000);
					}, function() {
						that.view.message = 'Email and/or password combination did not work!';
						that.view.messageClass = 'warning';
						$scope.$apply();
					}, function() {
						that.view.message = 'Please try again.';
						that.view.messageClass = 'warning';
						$scope.$apply();
					});
				};
			}],
			controllerAs: 'FormUserLoginCtrl'
		}
	});

	app.directive('formUserLogout', function() {

		/*
		TODO: Use $scope here and in template
		*/

		return {
			restrict: 'E',
			templateUrl: '/elements/formUserLogout.html',
			controller: ['$scope', '$timeout', '$location', 'accAuth', function($scope, $timeout, $location, accAuth) {
				var that = this;

				this.view = {
					message: '',
					messageClass: 'secondary',
					buttonClass: ''
				};

				this.logout = function() {
					accAuth.logout(function() {
						that.view.message = 'Now logging you out ...';
						that.view.messageClass = 'warning';
						buttonClass = 'disabled';
						$timeout(function() {
							that.view.message = 'Logged out!';
							that.view.messageClass = 'success';
							$timeout(function() {
								$location.path('/');
							}, 1000);
						}, 1000);
					});
				};
			}],
			controllerAs: 'FormUserLogoutCtrl'
		}
	});
	
	app.directive('formUserProfile', function() {

		/*
		TODO: Use $scope here and in template
		*/

		return {
			restrict: 'E',
			templateUrl: '/elements/formUserProfile.html',
			controller: ['$scope', '$timeout', 'accUser', function($scope, $timeout, accUser) {
				var that = this;

				this.view = {
					message: '',
					messageClass: 'secondary',
					buttonClass: 'enabled'
				};

				this.data = {
					email: '',
					firstName: '',
					lastName: ''
				};

				this.submit = function() {
					accUser.put(this.data, function() {
						that.view.messageClass = 'success';
						that.view.message = 'Saved!';
						that.view.buttonClass = 'disabled';
						$scope.$apply();
						$timeout(function() {
							that.view.message = '';
							that.view.messageClass = 'secondary';
							that.view.buttonClass = 'enabled';
						}, 2000);
					});
				};

				accUser.get(function(data) {
					$.extend(that.data, data.user);
				});
			}],
			controllerAs: 'FormUserProfileCtrl'
		}
	});


	app.directive('formUserPassword', function() {

		/*
		TODO: Use $scope here and in template
		*/

		return {
			restrict: 'E',
			templateUrl: '/elements/formUserPassword.html',
			controller: ['$scope', '$timeout', 'accUser', function($scope, $timeout, accUser) {
				var that = this;

				this.view = {
					message: '',
					messageClass: 'secondary',
					buttonClass: 'disabled'
				};

				this.data = {
					password: '',
					confirmPassword: ''
				};

				this.checkPasswordMatch = function() {
					if (!this.data.password && !this.data.confirmPassword) {
						this.view.message = '';
						this.view.messageClass = 'secondary';
						this.view.buttonClass = 'disabled';
						return false;
					}
					if (this.data.password != this.data.confirmPassword) {
						this.view.message = 'Your passwords do not match.';
						this.view.messageClass = 'secondary';
						this.view.buttonClass = 'disabled';
						return false;
					}
					this.view.message = 'Passwords match!';
					this.view.messageClass = 'success';
					this.view.buttonClass = 'enabled';
					return true;
				};

				this.submit = function() {
					accUser.put(this.data, function() {
						that.view.messageClass = 'success';
						that.view.message = 'Saved!';
						that.view.buttonClass = 'disabled';
						$scope.$apply();
						$timeout(function() {
							that.view.message = '';
							that.view.messageClass = 'secondary';
							that.view.buttonClass = 'enabled';
							that.data.password = '';
							that.data.confirmPassword = '';
							that.checkPasswordMatch();
						}, 2000);
					});
				};

			}],
			controllerAs: 'FormUserPasswordCtrl'
		}
	});





	app.directive('formUserRegister', function() {

		/*
		TODO: Use $scope here and in template
		*/

		return {
			restrict: 'E',
			templateUrl: '/elements/formUserRegister.html',
			controller: ['$scope', 'accAuth', function($scope, accAuth) {
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
						that.view.message = 'Welcome, ' + that.data.firstName + '! Logging in now!';
						that.view.messageClass = 'success';
						that.view.buttonClass = 'disabled';
						$scope.$apply();
					}, function() {
						that.view.message = 'Email has already been registered!';
						that.view.messageClass = 'warning';
						$scope.$apply();
					}, function() {
						that.view.message = 'Please try again!';
						that.view.messageClass = 'warning';
						$scope.$apply();
					});
				};
			}],
			controllerAs: 'FormUserRegisterCtrl'
		}
	});

	app.directive('crudItems', function() {
		return {
			restrict: 'E',
			templateUrl: '/elements/crudItems.html',
			controller: ['$scope', '$timeout', 'accItems', 'accPaywall', function($scope, $timeout, accItems, accPaywall) {
				var that = this;
				$scope.items = [];
				$scope.item = {};

				accPaywall.watchUsage($scope, 'items', {
					clear: [0, 8, function() {
						that.restrictCreate = false;
					}],
					suggest: [9, 9],
					warn: [10, 20, function() {
						that.restrictCreate = true;
					}]
				});

				accItems.getAll(function(items) {
					$scope.items = items;
				});

				this.create = function() {
					if (that.restrictCreate) { return; }

					$scope.item.buttonClass = 'disabled';
					accItems.post($scope.item, function(item) {
						$scope.items.unshift(item);
						$scope.item = {};
						$scope.item.buttonText = 'Created!';
						$scope.item.buttonClass = 'disabled success';
						$scope.$apply();
						$timeout(function() {
							$scope.item.buttonText = null;
							$scope.item.buttonClass = null;
						}, 1000);
					});
				};

				this.update = function(item) {
					accItems.put(item.id, item, function() {

					});
				};

				this.remove = function(item) {
					accItems.delete(item.id, function() {
						item.removeButtonText = 'Deleted!';
						item.removeButtonClass = 'disabled success';
						$scope.$apply();
						$timeout(function() {
							$scope.items = _.filter($scope.items, function(listItem) {
								return listItem != item;
							});
						}, 500);
					});
				};

			}],
			controllerAs: 'CrudItemsCtrl'
		}
	});



	app.directive('formUpgradeRecurring', function() {
		return {
			restrict: 'E',
			templateUrl: '/elements/formUpgradeRecurring.html',
			controller: ['$scope', '$timeout', '$location', 'accStripe', function($scope, $timeout, $location, accStripe) {
				var that = this;
				$scope.message = null;
				$scope.buttonText = null;
				$scope.buttonClass = null;
				$scope.showForm = null;

				this.submit = function() {
					var $form = $('form[name="upgradeRecurring"]', 'body');
					accStripe.createToken($form, function(sourceToken) {
						$scope.message = null;
						$scope.buttonText = 'Processing Payment ...';
						$scope.buttonClass = 'disabled';
						$scope.$apply();

						accStripe.createCustomer(sourceToken, function() {
							$scope.buttonText = 'Payment Successful!';
							$scope.buttonClass = null;
							$scope.$apply();
							$timeout(function() {
								$location.path('/dashboard');
							}, 2000);
						}, function(err) {
							$scope.message = err.message;
							$scope.buttonText = null;
							$scope.buttonClass = null;
							$scope.$apply();
						});
					}, function(errorMessage) {
						$scope.message = errorMessage;
						$scope.$apply();
					});
				};

				accStripe.setup(function() {
					$scope.showForm = true;
					$scope.$apply();
				});
			}],
			controllerAs: 'FormUpgradeRecurringCtrl'
		}
	});


})();