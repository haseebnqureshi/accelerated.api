module.exports = (function() {

    //loading accelerated's module with your appropriate settings
    var module = new require('accelerated.api.module')({

        //set your module's key for reference by middlwares, models, and routes 
        key: 'module',

        //set your module's name for logging output 
        name: 'Module',

        //you can choose to extend your module's model
        extendModel: function(model, express, app, models, settings) {

            //modify model to include user create, retrieve, update, and delete methods
            return model;

        },

        //you can choose to extend your module's middleware 
        appendMiddleware: function(express, app, models, settings) {

            //modify app to include user authentication middleware 
            return app;

        },

        //you can choose to extend your module's routes
        appendRoute: function(express, app, models, settings) {

            //modify app to include user CRUD routes 
            return app;

        }

    });

    //returning for use by accelerated.api
    return module;

})();