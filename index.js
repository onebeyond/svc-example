const system = require('./lib/system')
const runner = require('systemic-domain-runner')
const bunyan = require('bunyan')
const name = require('./package.json').name

process.env.SERVICE_ENV = process.env.SERVICE_ENV || 'local'

const emergencyLogger = process.env.SERVICE_ENV === 'local' ? console : bunyan.createLogger({ name: name })

runner(system(), { logger: emergencyLogger }).start((err, components) => {
    if (err) die('Error starting system', err)
})

function die(message, err) {
    emergencyLogger.error(err, message)
    process.exit(1)
}
