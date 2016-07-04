const path = require('path')
const unflatten = require('flat').unflatten
const async = require('async')
const merge = require('lodash.merge')

module.exports = function(options = {}) {

    const confabulous = options.confabulous || require('confabulous')
    const vault = options.confabulousVault || require('confabulous-vault-loader')
    const Confabulous = confabulous.Confabulous
    const loaders = merge({}, confabulous.loaders, { vault: vault })
    const processors = confabulous.processors
    let config

    function start(cb) {

        if (config) return cb(null, config)

        new Confabulous()
            .add((config) => loaders.require({ path: path.join(process.cwd(), 'conf/default.js'), watch: true }))
            .add((config) => loaders.require({ path: path.join(process.cwd(), `conf/${process.env.SERVICE_ENV}.js`), watch: true, mandatory: false }))
            .add((config) => loaders.require({ path: path.join(process.cwd(), 'conf/runtime.js'), watch: true, mandatory: false }))
            .add((config) => loaders.vault(merge({}, config.vault, { watch: { interval: '1m' }, mandatory: false })))
            .add((config) => loaders.env({}, [ processors.envToProps ]))
            .add((config) => loaders.args())
            .on('loaded', (config) => cb(null, config))
            .on('error', cb)
            .on('reloaded', function(_config) {
                config = _config
                process.emit('config_reloaded')
            })
            .on('reload_error', function(err) {
                process.emit('config_reload_error', err)
            })
            .end()
    }

    return {
        start: start
    }

}
