module.exports = function(Config, Users) {
	return {
		createWithUser: function() {
			console.log('documents create with psql');
			Users.create();
		}
	};
};

