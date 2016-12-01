const path = require('path')
const optional = require('optional')
const confabulous = require('../components/confabulous')
const pkg = require('../../../package')

const manifest = optional(path.join(process.cwd(), '../../../manifest.json')) || {}

module.exports = function setup(system) {
    system
    .configure(confabulous())
    .add('package', pkg)
    .add('manifest', manifest)
}
