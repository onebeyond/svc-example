const bunyan = require('bunyan')
const R = require('ramda')
const name = require('../../package.json').name
const log = bunyan.createLogger({ name: name })

module.exports = function(event) {
    log[event.level](R.omit(['level', 'message'], event), event.message)
}
