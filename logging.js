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

	var getLogLevelConstant = function(logLevel) {

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
	};

	var getLogFormat = function(logFormat) {
		return logFormat || '[:status] [:method] :url ========================';
	};

	var configureAndGetLogger = function(useConsole, useFile) {
		log4js.configure({
			appenders: getLogAppenders(
				useConsole || true,
				useFile || true
			)
		});

		return log4js.getLogger('api');
	};

	/*------
	Middleware
	------------*/

	//running our boilerplate logger logic
	var logger = configureAndGetLogger(
		process.env.API_LOG_CONSOLE, 
		process.env.API_LOG_FILE
	);

	//setting logger into app for application-wide access
	app.set('logger', logger);

	//inserting logger into app via middleware
	app.use(log4js.connectLogger(logger, { 
		level: getLogLevelConstant(process.env.API_LOG_LEVEL),
		format: getLogFormat(process.env.API_LOG_EXPRESS_FORMAT)
	}));

	/*------
	Returning App (ensuring app waterfalls)
	------------*/

	return app;

};