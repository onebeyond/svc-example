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
    let routes

    function init(dependencies, cb) {
        config = merge({ settings: { 'x-powered-by': false, 'etag': false }, bodyParser: { json: {} } }, dependencies.config)
        logger = dependencies.logger
        routes = dependencies.routes
        cb()
    }

    function validate(cb) {
        if (!logger) return cb(new Error('logger is required'))
        cb()
    }

    function start(cb) {
        let app = express()
        app.locals.logger = logger
        for (let key in config.settings) {
            app.set(key, config.settings[key])
        }
        app.use(bodyParser.json(config.bodyParser.json))
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.text())
        app.use(cookieParser())

        for (let key in routes) {
            routes[key](app)
        }

        app.use(get(options, 'handlers.notFound') || notFoundMiddleware);
        app.use(get(options, 'handlers.error') || errorMiddleware);
        cb(null, app)
    }

    function notFoundMiddleware(req, res, next) {
        dispatch(Boom.notFound(), req, res)
    }

    function errorMiddleware(err, req, res, next) {
        err = Boom.wrap(err)
        res.locals.logger.log(err)
        dispatch(err, req, res)
    }

    function dispatch(err, req, res) {
        res.status(err.output.statusCode)
        if (req.accepts('json')) res.set('Content-Type', 'application/json').send(JSON.stringify(err.output.payload) + '\n')
        else if (req.accepts(['application/xml', 'text/xml'])) res.set('Content-Type', 'text/xml').send(xml(err.output.payload)  + '\n')
        else res.send(`${err.output.payload.statusCode} ${err.output.payload.error}\n`)
    }

    return {
        start: async.seq(init, validate, start)
    }
}