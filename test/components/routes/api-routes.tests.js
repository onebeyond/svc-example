const assert = require('chai').assert
const async = require('async')
const system = require('../../test-system')
const request = require('request')
const R = require('ramda')

describe('API Routes', () => {

    let config
    let store
    let sys

    before(done => {
        sys = system().start((err, components) => {
            if (err) return done(err)
            config = components.config
            store = components.store
            done()
        })
    })

    beforeEach(done => {
        store.reset(done)
    })

    after(done => {
        async.series([
            cb => store.reset(cb),
            cb => sys.stop(cb)
        ], done)
    })

    describe('Get customer', () => {

        it('should return customer', done => {
            store.saveCustomer({ id: 'abc', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }, err => {
                assert.ifError(err)
                getCustomer('abc', (err, res, body) => {
                    assert.ifError(err)
                    assert.equal(res.statusCode, 200)
                    assert.equal(res.headers['content-type'], 'application/json; charset=utf-8')
                    assert.equal(body.firstName, 'Bob')
                    assert.equal(body.lastName, 'Holness')
                    assert.equal(body.dateOfBirth, '1928-11-12')
                    done()
                })
            })
        })

        it('should set status to 404 when customer does not exist', done => {
            getCustomer('abc', (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 404)
                done()
            })
        })
    })

    describe('Create customer', () => {

        const customer = { id: 'abc', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }

        it('should create a new customer', done => {
            createCustomer(customer, (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 204)
                store.getCustomer(customer.id, (err, dbCustomer) => {
                    assert.ifError(err)
                    assert.equal(dbCustomer.firstName, 'Bob')
                    assert.equal(dbCustomer.lastName, 'Holness')
                    assert.equal(dbCustomer.dateOfBirth, '1928-11-12')
                    done()
                })
            })
        })

        it('should require an id', done => {
            createCustomer(R.omit('id', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing id')
                done()
            })
        })

        it('should require a first name', done => {
            createCustomer(R.omit('firstName', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing firstName')
                done()
            })
        })

        it('should require a last name', done => {
            createCustomer(R.omit('lastName', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing lastName')
                done()
            })
        })

        it('should require a date of birth', done => {
            createCustomer(R.omit('dateOfBirth', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing dateOfBirth')
                done()
            })
        })
    })

    describe('Update customer', () => {

        const customer = { id: 'abc', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }

        it('should update an existing customer', done => {
            store.saveCustomer(customer, err => {
                assert.ifError(err)
                updateCustomer(customer.id, { id: customer.id, firstName: 'Bob', lastName: 'Monkhouse', dateOfBirth: '1928-06-01' }, (err, res, body) => {
                    assert.ifError(err)
                    assert.equal(res.statusCode, 204)
                    store.getCustomer(customer.id, (err, dbCustomer) => {
                        assert.ifError(err)
                        assert.equal(dbCustomer.firstName, 'Bob')
                        assert.equal(dbCustomer.lastName, 'Monkhouse')
                        assert.equal(dbCustomer.dateOfBirth, '1928-06-01')
                        done()
                    })
                })
            })
        })

        it('should not update a different customer', done => {
            store.saveCustomer(customer, err => {
                assert.ifError(err)
                updateCustomer('xyz', { id: customer.id, firstName: 'Bob', lastName: 'Monkhouse', dateOfBirth: '1928-06-01' }, (err, res, body) => {
                    assert.ifError(err)
                    assert.equal(res.statusCode, 400)
                    assert.equal(body.message, 'Id in url and body do not match')
                    done()
                })
            })
        })

        it('should create a customer that does not exist', done => {
            updateCustomer(customer.id, customer, (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 204)
                store.getCustomer(customer.id, (err, dbCustomer) => {
                    assert.ifError(err)
                    assert.equal(dbCustomer.firstName, 'Bob')
                    assert.equal(dbCustomer.lastName, 'Holness')
                    assert.equal(dbCustomer.dateOfBirth, '1928-11-12')
                    done()
                })
            })
        })

        it('should require a first name', done => {
            updateCustomer(customer.id, R.omit('firstName', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing firstName')
                done()
            })
        })

        it('should require a last name', done => {
            updateCustomer(customer.id, R.omit('lastName', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing lastName')
                done()
            })
        })

        it('should require a date of birth', done => {
            updateCustomer(customer.id, R.omit('dateOfBirth', customer), (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 400)
                assert.equal(body.message, 'Invalid or missing dateOfBirth')
                done()
            })
        })
    })

    describe('Delete customer', () => {

        const customer = { id: 'abc', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }

        it('should delete an existing customer', done => {
            store.saveCustomer(customer, err => {
                assert.ifError(err)
                deleteCustomer(customer.id, (err, res, body) => {
                    assert.ifError(err)
                    assert.equal(res.statusCode, 204)
                    done()
                })
            })
        })

        it('should pretend to delete a customer that does not exist', done => {
            deleteCustomer(customer.id, (err, res, body) => {
                assert.ifError(err)
                assert.equal(res.statusCode, 204)
                done()
            })
        })
    })

    function getCustomer(id, cb) {
        request({ url: getUrl(id), json: true }, cb)
    }

    function createCustomer(customer, cb) {
        request({ method: 'POST', url: getUrl(), json: customer }, cb)
    }

    function updateCustomer(id, customer, cb) {
        request({ method: 'POST', url: getUrl(id), json: customer }, cb)
    }

    function deleteCustomer(id, cb) {
        request({ method: 'DELETE', url: getUrl(id), json: true }, cb)
    }

    function getUrl(id) {
        return id ? `http://${config.server.host}:${config.server.port}/api/1.0/customers/${id}`
                  : `http://${config.server.host}:${config.server.port}/api/1.0/customers`
    }
})
