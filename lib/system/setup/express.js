const defaultMiddleware = require('systemic-express').defaultMiddleware
const prepperMiddleware = require('../components/prepper-middleware')
const app = require('systemic-express').app
const server = require('systemic-express').server
const adminRoutes = require('../../routes/admin-routes')

module.exports = function setup(system) {
    system
    .add('app', app()).dependsOn('config', 'logger')
    .add('middleware.prepper', prepperMiddleware()).dependsOn('logger', 'app')
    .add('routes.admin', adminRoutes()).dependsOn('manifest', 'app', 'middleware.prepper')
    .add('middleware.default', defaultMiddleware()).dependsOn('logger', 'app', 'routes.admin')
    .add('server', server()).dependsOn('config', 'app', 'mongodb', 'redis', 'postgres')
}
