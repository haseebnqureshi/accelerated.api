
/*------
Dependencies
------------*/

var express = require('express');
var app = express();



/*------
Loading env.json
------------*/

require('./env')(__dirname + '/env.json', __dirname + '/www/env.js');



/*------
Loading Models
------------*/

var models = require('./models')();



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

app.set('rootPath', __dirname);
app = require('./middleware')(express, app, models);
app = require('./routes')(express, app, models);



/*------
Server
------------*/

app.listen(process.env.EXPRESS_PORT, function() {
	console.log('Accelerated/API running on port ' + process.env.EXPRESS_PORT);
});
