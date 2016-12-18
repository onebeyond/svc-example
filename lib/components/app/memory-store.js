const R = require('ramda')

module.exports = function(options) {

    const customers = {}
    let clock

    function start(dependencies, cb) {
        clock = dependencies.clock
        cb(null, {
            saveCustomer,
            getCustomer,
            deleteCustomer,
            customers,
            reset
        })
    }

    function getCustomer(id, cb) {
        setImmediate(() => {
            cb(null, customers[id])
        })
    }

    function deleteCustomer(id, cb) {
        setImmediate(() => {
            const customer = customers[id]
            delete customers[id]
            cb(null, !!customer)
        })
    }

    function saveCustomer(params, cb) {
        const existing = customers[params.id]
        if (!existing) {
            customers[params.id] = R.merge({ created: clock.now(), updated: null }, params)
        } else {
            customers[params.id] = R.merge({ updated: clock.now() }, params)
        }
        cb()
    }

    function reset(cb) {
        Object.keys(customers).forEach((id) => {
            delete customers[id]
        })
        cb()
    }

    return {
        start: start
    }
}
