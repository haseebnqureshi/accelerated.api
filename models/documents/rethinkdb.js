module.exports = function(Config, Users) {
	return {
		createWithUser: function() {
			console.log('documents create with rethinkdb');
			Users.create();
		}
	};
};

