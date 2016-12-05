const System = require('systemic')
const confabulous = require('./components/confabulous')
const prepper = require('./components/prepper')
const defaultMiddleware = require('systemic-express').defaultMiddleware
const prepperMiddleware = require('./components/prepper-middleware')
const app = require('systemic-express').app
const server = require('systemic-express').server
const adminRoutes = require('./routes/admin-routes')
const mongodb = require('systemic-mongodb')
const redis = require('systemic-redis')
const postgres = require('systemic-pg')
const transports = require('./transports')
const pkg = require('../package')
const optional = require('optional')
const path = require('path')
const manifest = optional(path.join(process.cwd(), 'manifest.json')) || {}

module.exports = new System()
    .configure(confabulous())
    .add('pkg', pkg)
    .add('manifest', manifest)
    .add('transports', transports)
    .add('logger', prepper()).dependsOn('config', 'pkg', 'transports')
    .add('mongodb', mongodb()).dependsOn('config', 'logger')
    .add('redis', redis()).dependsOn('config', 'logger')
    .add('postgres', postgres()).dependsOn('config', 'logger')
    .add('app', app()).dependsOn('config', 'logger')
    .add('middleware.prepper', prepperMiddleware()).dependsOn('logger', 'app')
    .add('routes.admin', adminRoutes()).dependsOn('manifest', 'app', 'middleware.prepper')
    .add('middleware.default', defaultMiddleware()).dependsOn('logger', 'app', 'routes.admin')
    .add('server', server()).dependsOn('config', 'app', 'mongodb', 'redis', 'postgres')

