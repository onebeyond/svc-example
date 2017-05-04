process.env.SERVICE_ENV = process.env.SERVICE_ENV || 'local'

const system = require('./server/system')
const runner = require('systemic-domain-runner')
const bunyan = require('bunyan')
const name = require('./package.json').name
const emergencyLogger = process.env.SERVICE_ENV === 'local' ? console : bunyan.createLogger({ name: name })

runner(system(), { logger: emergencyLogger }).start((err, dependencies) => {
    if (err) die('Error starting system', err)
    dependencies.logger.info(`${dependencies.pkg.name} has started`)
})

function die(message, err) {
    emergencyLogger.error(err, message)
    process.exit(1)
}
