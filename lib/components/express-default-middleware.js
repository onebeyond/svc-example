var async = require('async')
var get = require('lodash.get')
var has = require('lodash.has')
var merge = require('lodash.merge')
var xml = require('jsontoxml')
var Boom = require('boom')

module.exports = function(options = {}) {

    var logger

    function init(dependencies, cb) {
        app = dependencies.app
        logger = dependencies.logger || app.locals.logger || console
        cb()
    }

    function validate(cb) {
        if (!app) return cb(new Error('app is required'))
        cb()
    }

    function start(cb) {
        app.use(get(options, 'handlers.notFound') || notFoundMiddleware);
        app.use(get(options, 'handlers.error') || errorMiddleware);
        cb(null, app)
    }

    function notFoundMiddleware(req, res, next) {
        dispatch(Boom.notFound(), req, res)
    }

    function errorMiddleware(err, req, res, next) {
        err = Boom.wrap(err)
        has(res, 'locals.logger') ? res.locals.logger.log(err) : logger.log(err)
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


