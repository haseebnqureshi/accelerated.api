
var api = require('accelerated.api');
var apiBodyParser = require('accelerated.api.body-parser').use();
var apiVersioning = require('accelerated.api.versioning').use();
var apiModule = require('./apiModule').use();
var apiModuleExtended = require('./apiModuleExtended').use();

api.useMiddlewares([
	[apiBodyParser.key, apiBodyParser.middleware],
	[apiVersioning.key, apiVersioning.middleware],
	[apiModule.key, apiModule.middleware],
	[apiModuleExtended.key, apiModuleExtended.middleware]
]);

api.useModels([
	[apiModule.key, apiModule.model],
	[apiModuleExtended.key, apiModuleExtended.model]
]);

api.useRoutes([
	[apiModule.key, apiModule.route],
	[apiModuleExtended.key, apiModuleExtended.route]
]);

api.run();
