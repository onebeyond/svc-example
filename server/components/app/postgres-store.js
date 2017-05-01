const SQL = require('./sql')
const R = require('ramda')

module.exports = function(options) {

    function start({ postgres, clock }, cb) {

        const db = postgres

        function getCustomer(id, cb) {
            db.query(SQL.SELECT_CUSTOMER_BY_ID, [id], (err, result) => {
                if (err) return cb(err)
                cb(null, toCustomer(result.rows[0]))
            })
        }

        function deleteCustomer(id, cb) {
            db.query(SQL.DELETE_CUSTOMER_BY_ID, [id], (err, result) => {
                if (err) return cb(err)
                cb(null, !!result.rowCount)
            })
        }

        function saveCustomer(params, cb) {
            db.query(SQL.SAVE_CUSTOMER, [
                params.id, params.title, params.firstName, params.lastName, params.dateOfBirth, new Date(clock.now())
            ], guard(cb))
        }

        function reset(cb) {
            db.query(SQL.TRUNCATE_ALL, guard(cb))
        }

        function toCustomer(row) {
            return row ? {
                id: row.id,
                title: row.title,
                firstName: row.first_name,
                lastName: row.last_name,
                dateOfBirth: `${row.date_of_birth.getFullYear()}-${row.date_of_birth.getMonth() + 1}-${row.date_of_birth.getDate()}`,
                created: row.created,
                updated: row.updated
            } : null
        }

        function guard(cb) {
            // PG can execute callback twice under certain error conditions
            return R.once(function(err) {
                cb(err)
            })
        }


        cb(null, {
            saveCustomer,
            getCustomer,
            deleteCustomer,
            reset
        })
    }

    return {
        start: start
    }
}
