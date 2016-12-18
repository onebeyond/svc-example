const System = require('systemic')
const optional = require('optional')
const clock = require('groundhog-day').real
const path = require('path')
const manifest = optional(path.join(process.cwd(), 'manifest.json')) || {}
const store = require('./postgres-store')

module.exports = new System({ name: 'app' })
    .add('manifest', manifest)
    .add('clock', clock())
    .add('store', store()).dependsOn('clock', 'postgres')
