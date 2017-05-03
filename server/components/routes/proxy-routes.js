const path = require('path')
const express = require('systemic-express/express')
const proxy = require('http-proxy-middleware')

module.exports = function() {

    function start({ app, config, logger }, cb) {

        app.use(express.static('./client/build'))

        Object.keys(config.routes).forEach(key => {
            app.use(key, proxy({ target: config.routes[key], logProvider: () => logger, changeOrigin: true }))
        })

        app.get('*', (req, res)  => {
          res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'))
        })

        cb()
    }

    return {
        start: start
    }
}
