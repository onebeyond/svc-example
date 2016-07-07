const system = require('./lib/system')
const runner = require('systemic-domain-runner')
const transports = require('./lib/transports')

runner(system).start((err, components) => {
    if (err) die('Error starting system', err)
    const logger = components.logger
    process.on('confabulous_reload_error', (err) => logger.error('Error reloading config', err))
})

function die(message, err) {
    const event = {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: message,
        service: {
            name: process.env['SERVICE_NAME'],
            env: process.env['SERVICE_ENV']
        },
        error: {
            message: err.message,
            stack: err.stack,
            code: err.code
        }
    }
    transports[process.env.LOGGER_TRANSPORT || 'json'](event)
    process.exit(1)
}