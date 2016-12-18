module.exports = function(options = {}) {

    function start({ app, store }, cb) {
        app.get('/api/1.0/example', (req, res) => res.json('dbz r us'))
        cb()
    }

    return {
        start: start
    }
}
