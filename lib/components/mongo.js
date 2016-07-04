const async = require('async')
const has = require('lodash.has')

module.exports = function(options = {}) {

    let MongoClient = options.MongoClient || require('mongodb')
    let db
    let config
    let logger

    function init(dependencies, cb) {
        config = dependencies.config
        logger = dependencies.logger
        cb()
    }

    function validate(cb) {
        if (!has(config, 'url')) return cb(new Error('config.url is required'))
        cb()
    }

    function start(cb) {
        logger.info(`Connecting to ${config.url}`, { mongo: config.options || {} })
        MongoClient.connect(config.url, config.options || {}, (err, _db) => {
            if (err) return cb(err)
            db = _db
            cb(null, db)
        })
    }

    function stop(cb) {
        if (!db) return cb()
        db.close(cb)
    }

    return {
        start: async.seq(init, validate, start),
        stop: stop
    }
}