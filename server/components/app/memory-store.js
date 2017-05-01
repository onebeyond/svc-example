const R = require('ramda')

module.exports = function(options) {

    function start({ clock }, cb) {

        const customers = {}

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
                customers[params.id] = R.merge({ created: new Date(clock.now()), updated: null }, params)
            } else {
                customers[params.id] = R.merge({ created: existing.created, updated: new Date(clock.now()) }, params)
            }
            cb()
        }

        function reset(cb) {
            Object.keys(customers).forEach((id) => {
                delete customers[id]
            })
            cb()
        }

        cb(null, {
            saveCustomer,
            getCustomer,
            deleteCustomer,
            customers,
            reset
        })
    }

    return {
        start: start
    }
}
