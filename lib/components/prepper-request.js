const async = require('async')
const pick = require('lodash.pick')
const onHeaders = require('on-headers')

module.exports = function(options = {}) {

    const prepper = options.prepper || require('prepper')
    const handlers = prepper.handlers
    let logger
    let app

    function init(dependencies, cb) {
        logger = dependencies.logger
        app = dependencies.app
        cb()
    }

    function validate(cb) {
        if (!logger) return cb(new Error('logger is required'))
        if (!app) return cb(new Error('app is required'))
        cb()
    }

    function start(cb) {

        app.use((req, res, next) => {
            const sequence = new handlers.Sequence([
                new handlers.Tracer(),
                new handlers.Merge(pick(req, ['url', 'method', 'headers', 'params']), { key: 'request' }),
            ])
            sequence.on('message', req.app.locals.logger.log)

            const logger = new prepper.Logger()
            logger.on('message', sequence.handle)

            onHeaders(res, () => {
                var response = { response: { statusCode: res.statusCode, headers: res.headers } }
                if (res.statusCode === 400) logger.error(req.url, response)
                if (res.statusCode < 500) logger.info(req.url, response)
                else logger.error(req.url, response)
            })

            res.locals.logger = logger

            next()
        })

        cb()
    }

    return {
        start: async.seq(init, validate, start)
    }
}
