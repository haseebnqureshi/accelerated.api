module.exports = function(app) {

	/*------
	Dependencies
	------------*/

	var log4js = require('log4js');

	var path = require('path');

	var fs = require('fs');

	/*------
	Helpers
	------------*/

	var conditionallyWriteFile = function(filepath) {

		//making sure our logs directory exists
		var dirname = path.dirname(filepath);
		try {
			fs.readdirSync(dirname);
		}
		catch (err) {
			fs.mkdirSync(dirname);
		}

		//then ensuring log file exists
		try {
			fs.readFileSync(filepath, 'utf8');
		}
		catch (err) {
			fs.writeFileSync(filepath, '', 'utf8');
		}
	};

	var getLogAppenders = function(useConsole, useFile) {
		var appenders = [];

		//without this, no console logging
		if (useConsole) {
			appenders.push({ type: 'console' });
		}

		//without this, no file logging
		if (useFile) {
			var filepath = path.join(process.env.PWD, 'logs', 'api.log');
			conditionallyWriteFile(filepath);
			appenders.push({
				type: 'file',
				filename: filepath,
				category: 'api'
			});
		}

		return appenders;
	};

	//whitelist log levels
	var whitelistLogLevel = function(logLevel) {

		/*
		@see https://github.com/nomiddlename/log4js-node/wiki/Category-levels
		Per log4js's documentation, possible levels can be:

		'ALL'
		'TRACE'
		'DEBUG'
		'INFO'
		'WARN'
		'ERROR'
		'FATAL'
		'OFF'
		*/

		return log4js.levels[logLevel || 'INFO'];
	}

	/*
	LOG MANAGER AND STRAPPING ONTO APP
	*/

	//creating logger manager for on-the-fly logging changes
	var logManager = {

		//current logger being used
		name: 'api',

		//current level being used
		level: 'INFO',

		//configuring initial log4js load
		init: function() {
			log4js.configure({
				appenders: getLogAppenders(
					process.env.API_LOG_CONSOLE || true,
					process.env.API_LOG_FILE || true
				)
			});
			return this;
		},

		//actually getting current logger
		get: function(logName) {

			//just for ease, we add a temporary override to logName
			var log = log4js.getLogger(logName || this.name);

			//set our log level for any log that we pull
			log.setLevel(this.level);

			return log;
		},

		//adding new logger
		add: function(logName, logFilepath) {

			//ensuring the file exists
			conditionallyWriteFile(logFilepath);

			log4js.addAppender(
				log4js.appenders.file(logFilepath), 
				logName
			);
			return this;
		},

		//method for ease
		addAndGet: function(logName, logFilepath) {
			this.add(logName, logFilepath);
			return this.get(logName);
		},

		//setting desired level for logger
		setLevel: function(logLevel) {

			//making sure our level is whitelisted
			this.level = whitelistLogLevel(logLevel);
			return this;
		},

		//switching to desired logger
		switchTo: function(logName) {
			this.name = logName;
			return this;
		},

		/*
		This could be extended for custom manipulation through app middleware!
		But proceed with caution, you really ought to know what's going
		on here!
		*/

		middleware: function(req, res, next) {
			var url = req.url;
			var method = req.method;
			var status = req.statusCode;

			//if our request has opened, we debug that opening
			if (req.complete === false) {
				logManager.get().debug('(open) [' + method + '] ' + url);
			}

			//and we then send info on finishing our response
			res.on('finish', function() {
				logManager.get().info('(close) [' + method + '] ' + url);
			});

			next();
		}

	};

	//initializing manager
	logManager.init();

	/*
	Setting logger manager into app for application-wide access. 
	Loading in as "log" for much easier reference and use.
	*/

	app.set('log', logManager);

	//but also setting it as logManager for those who like the desriptiveness
	app.set('logManager', logManager);

	/*
	Just to make sure any existing code relying on the initial
	logger code doesn't break, we keep the original logger avaialable.
	Having said that, this is DEPRECATED and everyone should move 
	to logManager!
	*/

	app.set('logger', logManager.get());

	//inserting our middleware directly into our express app	
	app.use('*', logManager.middleware);


	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};