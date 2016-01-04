
/*------
Model Documents (psql)
------------*/

module.exports = function(config, users) {

	/*------
	Defining Model
	------------*/

	var model = {

		createWithUser: function() {
			console.log('documents create with psql');
			users.create();
		}

	};

	/*------
	Returning Model
	------------*/

	return model;

};
