const prepper = require('../components/prepper')
const consoleLog = require('../transports/console-log')
const jsonLog = require('../transports/json-log')

module.exports = function setup(system) {
    system
    .add('transports.console', consoleLog)
    .add('transports.json', jsonLog)
    .add('logger', prepper()).dependsOn('package', 'config', 'transports.console', 'transports.json')
}
