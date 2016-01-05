
/*------
Dependencies
------------*/

var express = require('express');
var app = express();
var config = require('./config.js')();
var models = require('./models')(config);

/*------
Conditional Initializing
------------*/

process.argv.forEach(function(val, index, array) {
	if (index == 2 && val == 'setup') { 
		for (var i in models) {
			if (models[i]._init) {
				models[i]._init();
			}
		}
	}
});

/*------
Middleware & Routes
------------*/

app = require('./middleware')(express, app, config, models);
app = require('./routes')(express, app, config, models);

/*------
Server
------------*/

app.listen(config.APP_PORT, function() {
	console.log('Running on port ' + config.APP_PORT);
});
