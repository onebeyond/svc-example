const system = require('../server/system')
const clock = require('groundhog-day').fake
const store = require('../server/components/app/memory-store')

module.exports = function() {
    return system()
        .remove('migrator')
        .remove('postgres')
        .set('clock', clock())
        .set('store', store()).dependsOn('clock')
}

