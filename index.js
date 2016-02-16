
module.exports = function() {

	var express = require('express');
	var app = express();
	var fs = require('fs');
	var path = require('path');
	var _ = require('underscore');

	//Configure Accelerated
	app.set('rootPath', __dirname);
	require('./env')(process.env.HOME + '/env.json');

	var api = {

		app: app,

		express: express,

		models: {},

		findAppModuleFilepaths: function(type, appModules, dirnameOverride, iteratee) {

			//Loading listed app modules for type
			_.each(appModules, function(moduleKey) {
				if (iteratee) {
					var dirpath = dirnameOverride || process.env.HOME;
					var dirname = process.env['DIR_APP_' + type.toUpperCase()] || ('app_' + type);
					var filepath = [dirpath, dirname, moduleKey].join('/');
					iteratee(filepath);
				}
			});
		},

		findApiModuleFilepaths: function(type, iteratee) {

			//Loading accelerated.api built-in modules for type
			_.each(fs.readdirSync(__dirname + '/' + type), function(moduleKey) {
				if (iteratee) { 
					var dirpath = __dirname;
					var dirname = type;
					var filepath = [dirpath, dirname, moduleKey].join('/');
					iteratee(filepath); 
				}
			});
		},

		getModels: function() {
			return this.models;
		},

		useModules: function(type, appModules, dirnameOverride) {
			var that = this;

			/*
			AYSNC EACH MIGHT BE PROBLEMATIC. Keep an eye out for loading dependency
			issues. We may need to first safely create a master filepath array, and 
			then require module from start to end.
			*/

			this.findAppModuleFilepaths(type, appModules, dirnameOverride || null, function(filepath) {
				that.safelyRequireModule(type, filepath);
			});
			this.findApiModuleFilepaths(type, function(filepath) {
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

		useModels: function(appModules, dirnameOverride) {
			this.useModules('models', appModules, dirnameOverride || null);
		},

		useMiddlewares: function(appModules, dirnameOverride) {
			var bodyParser = require('body-parser');
			app.use(bodyParser.urlencoded({ extended: false }));
			app.use(bodyParser.json({ type: 'application/json' }));
			app.use(function(req, res, next) {
				res.header('Access-Control-Allow-Origin', '*');
				next();
			});
			this.useModules('middlewares', appModules, dirnameOverride || null);
		},

		useRoutes: function(appModules, dirnameOverride) {
			this.useModules('routes', appModules, dirnameOverride || null);
		}

	};

	return api;

};
