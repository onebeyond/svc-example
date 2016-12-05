const System = require('systemic')
const prepper = require('./prepper')
const console = require('./console')
const bunyan = require('./bunyan')

module.exports = new System()
    .add('transports.console', console())
    .add('transports.bunyan', bunyan()).dependsOn('pkg')
    .add('transports').dependsOn('transports.console', 'transports.bunyan')
    .add('logger', prepper()).dependsOn('config', 'pkg', 'transports')

