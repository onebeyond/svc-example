const System = require('systemic')
const path = require('path')

module.exports = function() {
    return new System({ name: 'svc-example' }).bootstrap(path.join(__dirname, 'components'))
}
