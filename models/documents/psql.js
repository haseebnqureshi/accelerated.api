
module.exports = function(config, users) {
	return {
		createWithUser: function() {
			console.log('documents create with psql');
			users.create();
		}
	};
};
