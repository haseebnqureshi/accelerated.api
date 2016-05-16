module.exports = (function() {

    var module = new require('../apiModule');

    module.setSettings({
        key: 'moduleExtended',
        name: 'Module Extended'

        /* You can choose to extend your middleware, model, and route here, too. */

    });

    return module;

})();