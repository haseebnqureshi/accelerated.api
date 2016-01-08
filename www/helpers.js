jQuery(function($) {

	$(document).foundation();

	window.endpoint = 'http://192.168.80.80:8080/v1';

	window.delay = function(delay, callback) {
		var delay = setInterval(function() {
			clearInterval(delay);
			callback();
		}, delay);
	};

})