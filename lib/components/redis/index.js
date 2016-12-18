const System = require('systemic')
const redis = require('systemic-redis')

module.exports = new System({ name: 'redis' })
    .add('redis', redis()).dependsOn('config', 'logger')
