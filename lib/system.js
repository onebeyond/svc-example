const System = require('systemic')
const confabulous = require('./components/confabulous')
const defaultMiddleware = require('systemic-express').defaultMiddleware
const prepperMiddleware = require('./components/prepper-middleware')
const app = require('systemic-express').app
const server = require('systemic-express').server
const adminRoutes = require('./routes/admin-routes')
const basics = require('./components/basics')
const logging = require('./components/logging')
const mongodb = require('./components/mongodb')
const redis = require('./components/redis')
const postgres = require('./components/postgres')

module.exports = new System()
    .configure(confabulous())
    .include(basics)
    .include(logging)
    .include(mongodb)
    .include(redis)
    .include(postgres)
    .add('app', app()).dependsOn('config', 'logger')
    .add('middleware.prepper', prepperMiddleware()).dependsOn('logger', 'app')
    .add('routes.admin', adminRoutes()).dependsOn('manifest', 'app', 'middleware.prepper')
    .add('middleware.default', defaultMiddleware()).dependsOn('logger', 'app', 'routes.admin')
    .add('server', server()).dependsOn('config', 'app', 'mongodb', 'redis', 'postgres')

