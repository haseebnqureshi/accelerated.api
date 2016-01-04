
//Dependencies ======

var express = require('express');
var bodyParser = require('body-parser');
var Config = require('./config.js')();
var Models = require('./models/index.js')(Config);
var app = express();

//App Middleware ======

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

//Routes ======

	//Route ===
	var router = express.Router();
	router.route('/')
		.get(function(req, res) {
			res.status(204).send();
		});
	app.use('/', router);

//Starting Server ======

app.listen(Config.PORT, function() {
	console.log('Running on port ' + Config.PORT);
});
