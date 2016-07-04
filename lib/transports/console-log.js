const async = require('async')
const chalk = require('chalk')
const hogan = require('hogan.js')
const merge = require('lodash.merge')
const has = require('lodash.has')
const pluck = require('lodash.pluck')

const response = hogan.compile('{{{displayTracer}}} {{{displayLevel}}} {{service.id}} {{{request.method}}} {{{response.statusCode}}} {{{request.url}}}')
const error = hogan.compile('{{{displayTracer}}} {{{displayLevel}}} {{service.id}} {{{message}}} {{{code}}}\n{{{error.stack}}} {{{details}}}')
const info = hogan.compile('{{{displayTracer}}} {{{displayLevel}}} {{service.id}} {{{message}}} {{{details}}}')

const colours = {
    debug: chalk.gray,
    info: chalk.white,
    warn: chalk.yellow,
    error: chalk.red,
    default: chalk.white
}

module.exports = function(event) {
    const details = pluck([], event)
    const data = merge({}, event, {
        displayTracer: has(event, 'tracer') ? event.tracer.substr(0, 6) : '------',
        displayLevel: event.level.toUpperCase(),
        details: Object.keys(details).length ? '\n' + JSON.stringify(details, null, 2) : ''
    })
    const colour = colours[event.level] || colours.default
    const log = console[event.level] || console.info
    if (has(event, 'response.statusCode')) log(colour(response.render(data)))
    else if (has(event, 'error.message')) log(colour(error.render(data)))
    else log(colour(info.render(data)))
}