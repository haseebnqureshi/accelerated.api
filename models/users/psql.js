
/*------
Model Users (psql)
------------*/

module.exports = function(config) {

	/*------
	Defining Model
	------------*/

	var model = {

		create: function() {
			console.log('users create with psql');
		}
		
	};

	/*------
	Returning Model
	------------*/

	return model;

};
