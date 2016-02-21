module.exports = function(envFilepath) {
	
	/*------
	Dependencies
	------------*/

	var fs = require('fs');

	/*------
	Reading env.json
	------------*/

	var data = fs.readFileSync(envFilepath);
	if (!data) { 
		throw 'Could not read env.json at ' + envFilepath; 
	}

	/*------
	Safely parsing env.json
	------------*/

	try {
		var config = JSON.parse(data);
	}
	catch(err) { 
		throw err; 
	}

	/*------
	Absorbing env into node process.env
	------------*/

	//Absorbing default variables
	for (var key in config.ENV_DEFAULT) {
		process.env[key] = config.ENV_DEFAULT[key];
	}

	//We may have environment overrides for each mode
	try {
		var override = config.ENV_OVERRIDE;
		var overrides = config.ENV_OVERRIDES;
		for (var key in overrides[override]) {
			process.env[key] = overrides[override][key];
		}
	}
	catch(err) { 

		//Any error here is non-fatal
		console.error(err); 
	}

};