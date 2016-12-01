const System = require('systemic')
const setup = require('./setup')

const setupComponents = [ 'basics', 'logging', 'store', 'express' ]
const system = new System()
setupComponents.forEach(function(comp) { setup[comp](system) })

module.exports = system

