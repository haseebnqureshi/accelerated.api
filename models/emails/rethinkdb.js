
/*------
Model Emails (rethinkdb)
------------*/

module.exports = function(config) {

	/*------
	Dependencies
	------------*/

	var _ = require('underscore');
	var mustache = require('mustache');
	var postmark = require('postmark');
	var fs = require('fs');

	/*------
	Helpers
	------------*/

	var helpers = {

	};

	/*------
	Defining Model
	------------*/

	var model = {

		emailParts: function(basename, data) {
			return {
				body: this.renderTemplate(basename + 'Body.html', data),
				subject: this.renderTemplate(basename + 'Subject.txt', data)
			}
		},

		renderTemplate: function(filename, data) {
			var template = fs.readFileSync(__dirname + '/templates/' + filename, 'utf8');
			var rendered = mustache.render(template, data);
			return rendered;
		},

		sendTo: function(to, basename, data, successCallback, errorCallback) {
			var email = this.emailParts(basename, data);
			var client = new postmark.Client(config.POSTMARK_API_TOKEN);
			client.sendEmail({
				From: config.POSTMARK_FROM,
				To: to,
				Subject: email.subject,
				HtmlBody: email.body
			}, function(err, success) {
				if (err && errorCallback) { return errorCallback(err); }
				if (successCallback) { return successCallback(successCallback); }
			});
		}

	};

	/*------
	Returning Model
	------------*/

	return model;

};
