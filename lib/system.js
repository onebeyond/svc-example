const System = require('systemic')
const confabulous = require('./components/confabulous')
const defaultMiddleware = require('systemic-express').defaultMiddleware
const prepperMiddleware = require('./components/prepper-middleware')
const app = require('systemic-express').app
const server = require('systemic-express').server
const adminRoutes = require('./routes/admin-routes')
const mongodb = require('systemic-mongodb')
const redis = require('systemic-redis')
const postgres = require('systemic-pg')
const basics = require('./components/basics')
const logging = require('./components/logging')

module.exports = new System()
    .configure(confabulous())
    .include(basics)
    .include(logging)
    .add('mongodb', mongodb()).dependsOn('config', 'logger')
    .add('redis', redis()).dependsOn('config', 'logger')
    .add('postgres', postgres()).dependsOn('config', 'logger')
    .add('app', app()).dependsOn('config', 'logger')
    .add('middleware.prepper', prepperMiddleware()).dependsOn('logger', 'app')
    .add('routes.admin', adminRoutes()).dependsOn('manifest', 'app', 'middleware.prepper')
    .add('middleware.default', defaultMiddleware()).dependsOn('logger', 'app', 'routes.admin')
    .add('server', server()).dependsOn('config', 'app', 'mongodb', 'redis', 'postgres')

