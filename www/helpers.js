jQuery(function($) {

	$(document).foundation();

	window.ajax = function(method, resource, data, statuses) {
		var args = {
			url: window.endpoint + '/' + resource,
			type: method,
			contentType: 'application/json',
			statusCode: statuses
		};
		if (data) {
			args.data = JSON.stringify(data);
		}
		$.ajax(args);
	};

	window.delay = function(delay, callback) {
		var delay = setInterval(function() {
			clearInterval(delay);
			callback();
		}, delay);
	};

})