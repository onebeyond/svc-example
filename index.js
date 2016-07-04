const system = require('./lib/system')
const get = require('lodash.get')
const duration = require('parse-duration')
const format = require('util').format
const domain = require('domain').create()
const signals = ['SIGINT', 'SIGTERM']
const transports = require('./lib/transports')

domain.run(() => {
    system.start((err, components) => {
        if (err) die('Error starting system', err)

        let restart

        process.on('config_reloaded', (config) => {
            clearTimeout(restart)
            const delayHuman = get(components, 'config.service.reload.window') || '60s'
            const delayInMillis = Math.floor(Math.random() * duration(delayHuman) / 1000) * 1000
            components.logger.info(format('Configuration reloaded. Service will restart in %s', delayHuman))
            restart = setTimeout(() => {
                system.restart((err, components) => {
                    if (err) die('Error restarting system', err)
                })
            }, delayInMillis).unref()
        })

        process.on('config_reload_error', (err) => {
            components.logger.error('Error reloading config', err)
        })

        signals.forEach((signal) => {
            process.on(signal, () => {
                components.logger.info(`Received ${signal}. Attempting to shutdown gracefully.`)
                system.stop(() => {
                    process.exit(0);
                })
            })
        })

        domain.on('error', (err) => {
            components.logger.error('Unhandled exception. Invoking shutdown', err)
            system.stop(() => {
                process.exit(1)
            })
        })
    })
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