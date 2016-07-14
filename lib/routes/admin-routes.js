const async = require('async')

module.exports = function(options = {}) {

    let manifest
    let app

    function init(dependencies, cb) {
        manifest = dependencies.manifest || {}
        app = dependencies.app
        cb()
    }

    function validate(cb) {
        if (!app) return cb(new Error('app is required'))
        cb()
    }

    function start(cb) {
        app.get('/manifest', (req, res) => res.json(manifest))
        cb()
    }

    return {
        start: async.seq(init, start)
    }
}
