const assert = require('chai').assert
const system = require('../server/system')
const request = require('request')

describe('Service Tests', () => {

    let config
    let sys

    before(done => {
        sys = system().start((err, components) => {
            if (err) return done(err)
            config = components.config
            done()
        })
    })

    after(done => {
        sys.stop(done)
    })

    it('should return manifest', done => {
        request({ url: `http://${config.server.host}:${config.server.port}/__/manifest`, json: true }, (err, res, body) => {
            assert.ifError(err)
            assert.equal(res.statusCode, 200)
            assert.equal(res.headers['content-type'], 'application/json; charset=utf-8')
            done()
        })
    })
})
