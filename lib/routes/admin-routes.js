const async = require('async')

module.exports = function(options = {}) {

    let manifest

    function init(dependencies, cb) {
        manifest = dependencies.manifest || {}
        cb()
    }

    function validate() {
        if (!manifest) return new Error('manifest is required')
    }

    function start(cb) {
        return cb(null, (app) => {
            app.get('/manifest', (req, res) => res.json(manifest))
        })
    }

    return {
        start: async.seq(init, start)
    }
}