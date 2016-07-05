const async = require('async')

module.exports = function(options) {

    let config
    let manifest

    function init(dependencies, cb) {
        manifest = dependencies.manifest || {}
        config = dependencies.config
        app = dependencies.app
        cb()
    }

    function validate() {
        if (!config) return new Error('config is required')
        if (!app) return new Error('app is required')
    }

    function start(cb) {
        app.get('/manifest', (req, res) => res.json(manifest))
        cb()
    }

    return {
        start: async.seq(init, start)
    }
}