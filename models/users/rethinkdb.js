
/*------
Model Users (rethinkdb)
------------*/

module.exports = function(config) {

	/*------
	Defining Model
	------------*/

	var model = {

		create: function() {
			console.log('users create with rethinkdb');
		}

	};

	/*------
	Returning Model
	------------*/

	return model;

};
