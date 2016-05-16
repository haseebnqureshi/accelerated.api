module.exports = (function() {
	
	/*------
	Dependencies
	------------*/

	var _ = require('underscore');

	var fs = require('fs');

	var path = require('path');

	var appEnvFilepath = path.join(process.env.PWD, 'env.json');

	var networkEnvFilepath = path.join(process.env.PWD, '../env.json');

	/*------
	Helpers
	------------*/

	var absorbDefaultEnv = function(envArgs) {

		if (!envArgs) { return; }
		if (_.isEmpty(envArgs)) { return; }

		//we start absorbing our envArgs.ENV_DEFAULT
		process.env = _.extend(process.env, envArgs.ENV_DEFAULT);

	};

	var preferOverrideEnv = function(envArgs) {

		if (!envArgs) { return; }
		if (_.isEmpty(envArgs)) { return; }

		//we may have environment overrides for each mode
		try {

			//so we find our current environment
			var override = envArgs.ENV_OVERRIDE;
			var environment = envArgs.ENV_OVERRIDES[override];

			//and absorb our environment variables
			process.env = _.extend(process.env, environment);

		}
		catch (err) {

		}
	};

	var preferNetworkEnv = function(networkEnvArgs) {

		//get the folder name of this project
		var folderName = path.basename(process.env.PWD);

		//load the network args that match with this project's folder name
		var masterArgs = networkEnvArgs[folderName];

		//if there are masterArgs, we prefer this env and load it in
		if (masterArgs) {
			process.env = _.extend(process.env, masterArgs);
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