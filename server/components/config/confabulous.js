const path = require('path')

module.exports = function(options = {}) {

    const Confabulous = options.confabulous || require('confabulous')
    const loaders = Confabulous.loaders
    let config

    function start(cb) {
        if (config) return cb(null, config)

        new Confabulous()
            .add(config => loaders.require({ path: path.join(process.cwd(), 'server', 'config', 'default.js'), watch: true }))
            .add(config => loaders.require({ path: path.join(process.cwd(), 'server', 'config', `${process.env.SERVICE_ENV}.js`), mandatory: false }))
            .add(config => loaders.require({ path: path.join(process.cwd(), 'secrets', 'secrets.json'), watch: true, mandatory: false }))
            .add(config => loaders.args())
            .on('loaded', cb)
            .on('error', cb)
            .end(cb)
    }

    return {
        start: start
    }

}
