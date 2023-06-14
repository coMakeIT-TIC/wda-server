var wda = require('./controller');

module.exports = function(router) {
    router.get('/blueprint/:project_id',wda.getBlueprint);
    router.get('/blueprints',wda.getBlueprints);
    router.post('/generate', wda.generate);
}