const System = require('systemic')
const defaultMiddleware = require('systemic-express').defaultMiddleware
const prepperMiddleware = require('./components/prepper-middleware')
const app = require('systemic-express').app
const server = require('systemic-express').server
const adminRoutes = require('../routes/admin-routes')
const mongodb = require('systemic-mongodb')
const redis = require('systemic-redis')
const postgres = require('systemic-pg')
const setup = require('./setup')

const system = new System()
    setup.basics(system)
    setup.logging(system)
    system
    .add('mongodb', mongodb()).dependsOn('config', 'logger')
    .add('redis', redis()).dependsOn('config', 'logger')
    .add('postgres', postgres()).dependsOn('config', 'logger')
    .add('app', app()).dependsOn('config', 'logger')
    .add('middleware.prepper', prepperMiddleware()).dependsOn('logger', 'app')
    .add('routes.admin', adminRoutes()).dependsOn('manifest', 'app', 'middleware.prepper')
    .add('middleware.default', defaultMiddleware()).dependsOn('logger', 'app', 'routes.admin')
    .add('server', server()).dependsOn('config', 'app', 'mongodb', 'redis', 'postgres')

module.exports = system

