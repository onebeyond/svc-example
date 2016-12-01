const async = require('async')
const merge = require('lodash.merge')
const get = require('lodash.get')
const format = require('util').format

module.exports = function(options = {}) {

    const prepper = options.prepper || require('prepper')
    const handlers = prepper.handlers
    let pkg
    let config
    let transport

    function init(dependencies, cb) {
        pkg = merge({}, dependencies.package)
        config = merge({ include: [], exclude: [] }, dependencies.config)
        transport = get(dependencies.transports, config.transport)
        cb()
    }

    function validate(cb) {
        if (!transport) return cb(new Error(format('Unknown transport: %s', config.transport)))
        cb()
    }

    function start(cb) {
        const logger = new prepper.Logger({ handlers: [
            new handlers.Merge({ package: pkg }),
            new handlers.Merge({ service: { env: process.env.SERVICE_ENV } }),
            new handlers.Process(),
            new handlers.System(),
            new handlers.Timestamp(),
            new handlers.Flatten(),
            new handlers.KeyFilter({ include: config.include, exclude: config.exclude }),
            new handlers.Unflatten()
        ]}).on('message', transport)

        cb(null, logger)
    }

    return {
        start: async.seq(init, validate, start)
    }
}
