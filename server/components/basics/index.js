const System = require('systemic')
const path = require('path')
const pkg = require(path.join(process.cwd(), 'package.json'))

module.exports = new System({ name: 'basics' })
    .add('pkg', pkg)

