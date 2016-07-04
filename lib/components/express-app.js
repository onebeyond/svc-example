const async = require('async')
const get = require('lodash.get')
const merge = require('lodash.merge')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const xml = require('jsontoxml')
const Boom = require('boom')
const debug = require('debug')('svc:components:express-app')

module.exports = function(options = {}) {

    const express = options.express || require('express')
    let config
    let logger

    function init(dependencies, cb) {
        config = merge({ settings: { 'x-powered-by': false, 'etag': false }, bodyParser: { json: {} } }, dependencies.config)
        logger = dependencies.logger
        cb()
    }

    function validate(cb) {
        if (!logger) return cb(new Error('logger is required'))
        cb()
    }

    function start(cb) {
        let app = express()
        app.locals.logger = logger
        for (var key in config.settings) {
            app.set(key, config.settings[key])
        }
        app.use(bodyParser.json(config.bodyParser.json))
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.text())
        app.use(cookieParser())
        cb(null, app)
    }

    return {
        start: async.seq(init, validate, start)
    }
}