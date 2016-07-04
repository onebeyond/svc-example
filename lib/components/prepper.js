const async = require('async')
const path = require('path')
const os = require('os')
const merge = require('lodash.merge')
const get = require('lodash.get')
const format = require('util').format

module.exports = function(options = {}) {

    const prepper = options.prepper || require('prepper')
    const handlers = prepper.handlers
    let config
    let transport

    function init(dependencies, cb) {
        config = merge({ transport: 'json', include: [], exclude: [] }, dependencies.config)
        transport = get(dependencies.transports, config.transport)
        cb()
    }

    function validate(cb) {
        if (!transport) return cb(new Error(format('Unknown transport: %s', config.transport)))
        cb()
    }

    function start(cb) {
        const sequence = new handlers.Sequence([
            new handlers.Merge({ package: options.package || {} }),
            new handlers.Merge({ service: { name: process.env.SERVICE_NAME, env: process.env.SERVICE_ENV } }),
            new handlers.Process(),
            new handlers.System(),
            new handlers.Timestamp(),
            new handlers.Flatten(),
            new handlers.KeyFilter({ include: config.include, exclude: config.exclude }),
            new handlers.Unflatten()
        ]).on('message', function(event) {
            transport.log(event)
        })

        const logger = new prepper.Logger()
        logger.on('message', sequence.handle)
        cb(null, logger)
    }

    return {
        start: async.seq(init, validate, start)
    }
}