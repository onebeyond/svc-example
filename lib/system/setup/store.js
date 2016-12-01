const mongodb = require('systemic-mongodb')
const redis = require('systemic-redis')
const postgres = require('systemic-pg')

module.exports = function setup(system) {
    system
    .add('mongodb', mongodb()).dependsOn('config', 'logger')
    .add('redis', redis()).dependsOn('config', 'logger')
    .add('postgres', postgres()).dependsOn('config', 'logger')
}
