module.exports = (function() {
	
	/*------
	Dependencies
	------------*/

	var _ = require('underscore');

	var fs = require('fs');

	var path = require('path');

	var appEnvFilepath = path.join(process.env.HOME, 'env.json');

	var networkEnvFilepath = path.join(process.env.HOME, '../env.json');

	/*------
	Helpers
	------------*/

	var absorbDefaultEnv = function(envArgs) {

		if (!envArgs) { return; }
		if (_.isEmpty(envArgs)) { return; }

		//we start absorbing our envArgs.ENV_DEFAULT
		for (var key in envArgs.ENV_DEFAULT) {
			process.env[key] = envArgs.ENV_DEFAULT[key];
		}

	};

	var preferOverrideEnv = function(envArgs) {

		if (!envArgs) { return; }
		if (_.isEmpty(envArgs)) { return; }

		//we may have environment overrides for each mode
		try {
			var override = envArgs.ENV_OVERRIDE;
			var overrides = envArgs.ENV_OVERRIDES;
			for (var key in overrides[override]) {
				process.env[key] = overrides[override][key];
			}
		}
		catch (err) {

		}
	};

	var preferNetworkEnv = function(networkEnvArgs) {

		//get the folder name of this project
		var folderName = path.basename(process.env.HOME);

		//load the network args that match with this project's folder name
		var masterArgs = networkEnvArgs[folderName];

		//if there are masterArgs, we prefer this env and load it in
		if (masterArgs) {
			for (var key in masterArgs) {
				process.env[key] = masterArgs[key];
			}
		}
	};

	var getEnv = function(filepath) {

		//reading our env filepath
		try {
			var data = fs.readFileSync(filepath);
		}
		catch (err) {
			return {};
		}

		//now we try to parse our data as json
		try {
			var env = JSON.parse(data);
		}

		//and catch any potential errors it may throw
		catch(err) { 
			return {};
		}

		//now everyting's good and we return our parsed env
		return env;

	};

	/*------
	Loading app-level environment	
	------------*/

	var appEnv = getEnv(appEnvFilepath);

	absorbDefaultEnv(appEnv);

	preferOverrideEnv(appEnv);

	/*------
	Loading network-level environment	
	------------*/

	var networkEnv = getEnv(networkEnvFilepath);

	preferNetworkEnv(networkEnv);

})();