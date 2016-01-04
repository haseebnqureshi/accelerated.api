
/*------
Model Documents (rethinkdb)
------------*/

module.exports = function(config, users) {

	/*------
	Defining Model
	------------*/

	var model = {

		createWithUser: function() {
			console.log('documents create with rethinkdb');
			users.create();
		}

	};

	/*------
	Returning Model
	------------*/

	return model;

};
