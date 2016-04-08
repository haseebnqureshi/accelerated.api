module.exports = (function() {

	/*------
	Dependencies
	------------*/

	var express = require('express');
	var app = express();
	var path = require('path');
	var _ = require('underscore');

	/*------
	Configuring accelerated.api
	------------*/

	app.set('rootPath', __dirname);

	/*------
	Helpers
	------------*/

	/* Loading our environment files */
	require('./env');

	/*------
	Logging
	------------*/

	/* Loading our logging configuration */
	app = require('./logging')(app);

	/*------
	Accessible Methods
	------------*/

	var api = {

		app: app,

		express: express,

		models: {},

		getModels: function() {
			return this.models;
		},

		getModuleFilepathByKey: function(type, moduleKey, dirnameOverride) {

			//Setting base to dir where node runs, or to override given
			var dirpath = dirnameOverride || process.env.PWD;

			//Specifying folder where module lives
			var dirname = process.env['DIR_APP_' + type.toUpperCase()] || ('app_' + type);

			//Joining parts into usable filepath
			return [dirpath, dirname, moduleKey].join('/');
		},

		useModules: function(type, modules, dirnameOverride) {
			var that = this;

			/*
			AYSNC EACH MIGHT BE PROBLEMATIC. Keep an eye out for loading dependency
			issues. We may need to first safely create a master filepath array, and 
			then require module from start to end.
			*/

			_.each(modules, function(module) {

				/*
				Module can be either an array (for a direct module loaded in) or a
				string (representing a presumed module that exists in the app
				directory, apprioriate to the type).

				If directly loading a module, the array has two values:

				[ 'moduleKey', (function(){ return module; }) ]

				1. moduleKey, in which module can be referenced by a key
				2. CommonJS module, a function that can be executed
				*/

				//If the module is directly loaded
				if (_.isArray(module)) {

					//And indeed, we have an array with a string value
					if (_.isString(module[0])) {

						//If we then have a second value as function, we load module
						if (_.isFunction(module[1])) {
							
							//We try loading the module directly
							return that.safelyRequireModule(type, module[1], module[0]);
						}

						//Otherwise if an object has a "use" method, we also load our module
						//This is our newer modules, which our logic later handles when loading.
						if (_.isObject(module[1])) {
							if (module[1].use) {

								//We try loading the module directly
								return that.safelyRequireModule(type, module[1], module[0]);
							}
						}
					}
				}

				//Otherwise if string
				else if (_.isString(module)) {

					//We get the module's assumed filepath
					var filepath = that.getModuleFilepathByKey(type, module, dirnameOverride || null);

					//And then we try to safely load our module
					return that.safelyRequireModuleFilepath(type, filepath);
				}
			});
		},

		run: function(callback) {
			app.listen(process.env.EXPRESS_PORT, function() {
				console.log('Running on port ' + process.env.EXPRESS_PORT);
				if (callback) { return callback(this); }
			});
		},

		safelyRequireModuleFilepath: function(type, filepath) {
			try {
				var module = require(filepath);
				var moduleKey = path.basename(filepath);
			}
			catch(err) {
				throw err;
			}
			this.safelyRequireModule(type, module, moduleKey);
		},

		safelyRequireModule: function(type, module, moduleKey) {
			var that = this;

			//if we're using newer modules, we look for our method "use"
			if (module.use) {
				return that.safelyRequireModuleNewer(type, module, moduleKey);
			}

			//otherwise, we load our legacy logic
			else {
				return that.safelyRequireModuleLegacy(type, module, moduleKey);
			}
		},

		safelyRequireModuleLegacy: function(type, module, moduleKey) {
			try {
				var result = module(this.express, this.app, this.getModels());

				if (type == 'models') {
					this.models[moduleKey] = result;
				}

				else {
					this.app = result;
				}
			}
			catch(err) {
				throw err;
			}
			console.info('[Loaded ' + type + '] -- ' + moduleKey);
		},

		safelyRequireModuleNewer: function(type, module, moduleKey) {
			try {

				//main difference from legacy is use of module's method "use"
				var result = module.use(this.express, this.app, this.getModels());

				if (type == 'models') {
					this.models[moduleKey] = result;
				}
				
				else {
					this.app = result;
				}
			}
			catch(err) {
				throw err;
			}
			console.info('[Loaded ' + type + '] -- ' + moduleKey);
		},

		useModels: function(modules, dirnameOverride) {
			this.useModules('models', modules || [], dirnameOverride || null);
		},

		useMiddlewares: function(modules, dirnameOverride) {
			this.useModules('middlewares', modules || [], dirnameOverride || null);
		},

		useRoutes: function(modules, dirnameOverride) {
			this.useModules('routes', modules || [], dirnameOverride || null);
		}

	};

	/*------
	Returning instance
	------------*/

	return api;

})();