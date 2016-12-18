const system = require('../lib/system')
const clock = require('groundhog-day').fake
const store = require('../lib/components/app/memory-store')

module.exports = function() {
    return system()
        .remove('migrator')
        .remove('postgres')
        .set('clock', clock())
        .set('store', store()).dependsOn('clock')
}

