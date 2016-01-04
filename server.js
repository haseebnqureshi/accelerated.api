
/*------
Dependencies
------------*/

var express = require('express');
var app = express();
var config = require('./config.js')();
var models = require('./models/index.js')(config);

/*------
Middleware & Routes
------------*/

app = require('./middleware/index.js')(express, app, config, models);
app = require('./routes/index.js')(express, app, config, models);

/*------
Server
------------*/

app.listen(config.PORT, function() {
	console.log('Running on port ' + config.PORT);
});
