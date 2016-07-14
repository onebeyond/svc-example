const async = require('async')
const merge = require('lodash.merge')

module.exports = function(options = {}) {

    const express = options.express || require('express')
    let config
    let logger

    function init(dependencies, cb) {
        config = merge({
            settings: { 'x-powered-by': false, 'etag': false }
        }, dependencies.config)
        logger = dependencies.logger || console
        cb()
    }

    function start(cb) {
        let app = express()
        app.locals.logger = logger
        for (let key in config.settings) {
            app.set(key, config.settings[key])
        }
        cb(null, app)
    }

    return {
        start: async.seq(init, start)
    }
}