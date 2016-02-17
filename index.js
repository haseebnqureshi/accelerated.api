
module.exports = function() {

	var express = require('express');
	var app = express();
	var fs = require('fs');
	var path = require('path');
	var _ = require('underscore');

	//Configure Accelerated
	app.set('rootPath', __dirname);
	require('./env')(process.env.HOME + '/env.json');

	//Adding safely load method with informative messages
	app.set('safelyLoad', function(moduleName, dirname) {
		try {
			var module = require(moduleName);
		}
		catch(err) {
			var message = '! [ERROR] ' + dirname + '\n' 
				+ '! [ERROR] Could not load module ' + moduleName + '. ';
			switch(moduleName) {
				case 'rethinkdb':
					message += 'Please sudo su and "acc provision --database=rethinkdb"!';
				break;
				case 'postgres':
					message += 'Please sudo su and "acc provision --database=postgres"!';
				break;
			}
			console.log(message);
		}
		return module;
	});

	var api = {

		app: app,

		express: express,

		models: {},

		findAppModuleFilepaths: function(type, modules, dirnameOverride, iteratee) {
			if (!iteratee) { return; }

			//Loading listed app modules for type
			_.each(modules, function(module) {

				//Setting base to dir where node runs, or to override given
				var dirpath = dirnameOverride || process.env.HOME;

				//However, modules prefixed with "acc" are loaded from this package
				if (module.match(/^acc/)) { dirpath = __dirname; }

				//Specifying folder where module lives
				var dirname = process.env['DIR_APP_' + type.toUpperCase()] || ('app_' + type);

				//Joining parts into usable filepath
				var filepath = [dirpath, dirname, module].join('/');

				iteratee(filepath);
			});
		},

		getModels: function() {
			return this.models;
		},

		useModules: function(type, modules, dirnameOverride) {
			var that = this;

			/*
			AYSNC EACH MIGHT BE PROBLEMATIC. Keep an eye out for loading dependency
			issues. We may need to first safely create a master filepath array, and 
			then require module from start to end.
			*/

			this.findAppModuleFilepaths(type, modules, dirnameOverride || null, function(filepath) {
				that.safelyRequireModule(type, filepath);
			});
		},

		run: function(callback) {
			app.listen(process.env.EXPRESS_PORT, function() {
				console.log('Running on port ' + process.env.EXPRESS_PORT);
				if (callback) { return callback(); }
			});
		},

		safelyRequireModule: function(type, filepath) {
			var that = this;
			try {
				if (type == 'models') {
					var model = require(filepath)(that.express, that.app, that.getModels());
					var modelKey = path.basename(filepath);
					that.models[modelKey] = model;
				}
				else {
					that.app = require(filepath)(that.express, that.app, that.getModels());
				}
				console.info('[Loaded ' + type + '] -- ' + filepath);
			}
			catch(err) {
				throw err;
			}
		},

		useModels: function(modules, dirnameOverride) {

			/*
			If no modules specified, we load our deafult acc modules. Right now this 
			is explicitly defined in the package with no good override options, but
			we'll expand this in the future.
			*/
			
			var modules = modules || ['accEmails', 'accItems', 'accUsers'];
			this.useModules('models', modules, dirnameOverride || null);
		},

		useMiddlewares: function(modules, dirnameOverride) {

			/*
			If no modules specified, we load our deafult acc modules. Right now this 
			is explicitly defined in the package with no good override options, but
			we'll expand this in the future.

			Also note, loaded from left to right, waterfalling each module.
			*/

			var modules = modules || ['accBodyParser', 'accLogin'];
			this.useModules('middlewares', modules, dirnameOverride || null);
		},

		useRoutes: function(modules, dirnameOverride) {

			/*
			If no modules specified, we load our deafult acc modules. Right now this 
			is explicitly defined in the package with no good override options, but
			we'll expand this in the future.

			Also note, loaded from left to right, waterfalling each module.
			*/

			var modules = modules || ['accLogin', 'accItems', 'accStripe'];
			this.useModules('routes', modules, dirnameOverride || null);
		}

	};

	return api;

};
