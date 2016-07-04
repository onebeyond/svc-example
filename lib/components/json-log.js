const async = require('async')
const omit = require('lodash.omit')

module.exports = function() {

    function start(cb) {
        cb(null, { log: log })
    }

    function log(event) {
        console.log(JSON.stringify(event))
    }

    return {
        start: start
    }
}